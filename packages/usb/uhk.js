const util = require('util');
const HID = require('node-hid');
// const debug = process.env.DEBUG;
const debug = true;

function bufferToString(buffer) {
    let str = '';
    for (let i = 0; i < buffer.length; i++) {
        let hex = buffer[i].toString(16) + ' ';
        if (hex.length <= 2) {
            hex = '0' + hex;
        }
        str += hex;
    }
    return str;
}

function getUint16(buffer, offset) {
    return (buffer[offset]) + (buffer[offset+1] * 2**8);
}

function getUint32(buffer, offset) {
    return (buffer[offset]) + (buffer[offset+1] * 2**8) + (buffer[offset+2] * 2**16) + (buffer[offset+3] * 2**24);
}

function uint32ToArray(value) {
    return [(value >> 0) & 0xff, (value >> 8) & 0xff, (value >> 16) & 0xff, (value >> 24) & 0xff];
}

function writeDevice(device, data, options={}) {
    device.write(getTransferData(new Buffer(data)));
    if (options.noRead) {
        return Promise.resolve();
    }
    return util.promisify(device.read.bind(device))();
}

function getUhkDevice() {
    const foundDevice = HID.devices().find(device =>
        device.vendorId === 0x1d50 && device.productId === 0x6122 &&
        ((device.usagePage === 128 && device.usage === 129) || device.interface === 0));

    if (!foundDevice) {
        return null;
    }

    let hid;
    try {
        hid = new HID.HID(foundDevice.path);
    } catch (error) {
        // Already jumped to the bootloader, so ignore this exception.
        return null;
    }
    return hid;
}

function getBootloaderDevice() {
    const foundDevice = HID.devices().find(device =>
        device.vendorId === 0x1d50 && device.productId === 0x6120);

    if (!foundDevice) {
        return null;
    }

    return foundDevice;
}

function checkFirmwareImage(imagePath, extension) {
    if (!imagePath) {
        echo('No firmware image specified.');
        exit(1);
    }

    if (!imagePath.endsWith(extension)) {
        echo(`Firmware image extension is not ${extension}`);
        exit(1);
    }

    if (!test('-f', imagePath)) {
        echo('Firmware image does not exist.');
        exit(1);
    }
}

function getBlhostCmd(pid) {
    let blhostPath;
    switch (process.platform) {
        case 'linux':
            const arch = exec('uname -m', {silent:true}).stdout.trim();
            blhostPath = `linux/${arch}/blhost`;
            break;
        case 'darwin':
            blhostPath = 'mac/blhost';
            break;
        case 'win32':
            blhostPath = 'win/blhost.exe';
            break;
        default:
            echo('Your operating system is not supported.');
            exit(1);
            break;
    }

    return `${__dirname}/blhost/${blhostPath} --usb 0x1d50,0x${pid.toString(16)}`;
}

function execRetry(command) {
    let firstRun = true;
    let remainingRetries = 3;
    let code;
    do {
        if (!firstRun) {
            console.log(`Retrying ${command}`)
        }
        config.fatal = !remainingRetries;
        code = exec(command).code;
        config.fatal = true;
        firstRun = false;
    } while(code && --remainingRetries);
}

let configBufferIds = {
    hardwareConfig: 0,
    stagingUserConfig: 1,
    validatedUserConfig: 2,
};

let eepromOperations = {
    read: 0,
    write: 1,
};

async function updateDeviceFirmware(firmwareImage, extension) {
    const usbDir = `${__dirname}`;
    const blhost = uhk.getBlhostCmd(uhk.enumerationNameToProductId.bootloader);

    uhk.checkFirmwareImage(firmwareImage, extension);
    config.verbose = true;

    await uhk.reenumerate('bootloader');
    exec(`${blhost} flash-security-disable 0403020108070605`);
    exec(`${blhost} flash-erase-region 0xc000 475136`);
    exec(`${blhost} flash-image ${firmwareImage}`);
    exec(`${blhost} reset`);

    config.verbose = false;
    echo('Firmware updated successfully.');
};

// USB commands

function reenumerate(enumerationMode) {
    const bootloaderTimeoutMs = 5000;
    const pollingIntervalMs = 100;
    let pollingTimeoutMs = 10000;

    let jumped = false;

    return new Promise((resolve, reject) => {
        const enumerationModeId = exports.enumerationModes[enumerationMode];

        if (enumerationModeId === undefined) {
            const enumerationModes = Object.keys(exports.enumerationModes).join(', ');
            console.log(`Invalid enumeration mode '${enumerationMode}' is not one of: ${enumerationModes}`);
            reject();
            return;
        }

        console.log(`Trying to reenumerate as ${enumerationMode}...`);
        const intervalId = setInterval(async function() {
            pollingTimeoutMs -= pollingIntervalMs;

            const foundDevice = HID.devices().find(device =>
                device.vendorId === exports.vendorId && device.productId === exports.enumerationModeIdToProductId[enumerationModeId]);

            if (foundDevice) {
                console.log(`${enumerationMode} is up`);
                resolve();
                clearInterval(intervalId);
                return;
            }

            if (pollingTimeoutMs <= 0) {
                console.log(`Couldn't reenumerate as ${enumerationMode}`);
                reject();
                clearInterval(intervalId);
                return;
            }

            let device = exports.getUhkDevice();
            if (device && !jumped) {
                console.log(`UHK found, reenumerating as ${enumerationMode}`);
                await writeDevice(device, [exports.usbCommands.reenumerate, enumerationModeId, ...uint32ToArray(bootloaderTimeoutMs)], {noRead:true});
                jumped = true;
            }

        }, pollingIntervalMs);
    })
};

async function sendKbootCommandToModule(device, kbootCommandId, i2cAddress) {
    return await uhk.writeDevice(device, [uhk.usbCommands.sendKbootCommandToModule, kbootCommandId, parseInt(i2cAddress)])
};

async function jumpToModuleBootloader(device, moduleSlotId) {
    await uhk.writeDevice(device, [uhk.usbCommands.jumpToModuleBootloader, moduleSlotId]);
};

async function switchKeymap(device, keymapAbbreviation) {
    const keymapAbbreviationAscii = keymapAbbreviation.split('').map(char => char.charCodeAt(0));
    const payload = [uhk.usbCommands.switchKeymap, keymapAbbreviation.length, ...keymapAbbreviationAscii];
    return await uhk.writeDevice(device, payload);
}

async function waitForKbootIdle(device) {
    const intervalMs = 100;
    const pingMessageInterval = 500;
    let timeoutMs = 10000;

    return new Promise((resolve, reject) => {
        const intervalId = setInterval(async function() {
            const response = await uhk.writeDevice(device, [uhk.usbCommands.getDeviceProperty, uhk.devicePropertyIds.currentKbootCommand]);
            const currentKbootCommand = response[1];
            if (currentKbootCommand == 0) {
                console.log('Bootloader pinged.');
                resolve();
                clearInterval(intervalId);
                return;
            } else if (timeoutMs % pingMessageInterval === 0) {
                console.log("Cannot ping the bootloader. Please reconnect the left keyboard half. It probably needs several tries, so keep reconnecting until you see this message.");
            };

            timeoutMs -= intervalMs;

            if (timeoutMs < 0) {
                reject();
                clearInterval(intervalId);
                return;
            }
        }, intervalMs);
    });
}

async function updateModuleFirmware(i2cAddress, moduleSlotId, firmwareImage) {
    const usbDir = `${__dirname}`;
    const blhostUsb = uhk.getBlhostCmd(uhk.enumerationNameToProductId.buspal);
    const blhostBuspal = `${blhostUsb} --buspal i2c,${i2cAddress}`;

    config.verbose = true;
    let device = uhk.getUhkDevice();
    await uhk.sendKbootCommandToModule(device, uhk.kbootCommands.ping, i2cAddress);
    await uhk.jumpToModuleBootloader(device, moduleSlotId);
    await uhk.waitForKbootIdle(device);
    device.close();

    await uhk.reenumerate('buspal');
    uhk.execRetry(`${blhostBuspal} get-property 1`);
    exec(`${blhostBuspal} flash-erase-all-unsecure`);
    exec(`${blhostBuspal} write-memory 0x0 ${firmwareImage}`);
    exec(`${blhostUsb} reset`);

    await uhk.reenumerate('normalKeyboard');
    device = uhk.getUhkDevice();
    await uhk.sendKbootCommandToModule(device, uhk.kbootCommands.reset, i2cAddress);
    await uhk.sendKbootCommandToModule(device, uhk.kbootCommands.idle, i2cAddress);
    device.close();
    config.verbose = false;
    echo('Firmware updated successfully.');
};

uhk = exports = module.exports = moduleExports = {
    bufferToString,
    getUint16,
    getUint32,
    uint32ToArray,
    writeDevice,
    getUhkDevice,
    getBootloaderDevice,
    getTransferData,
    checkModuleSlot,
    checkFirmwareImage,
    getBlhostCmd,
    execRetry,
    updateDeviceFirmware,
    reenumerate,
    sendKbootCommandToModule,
    jumpToModuleBootloader,
    switchKeymap,
    waitForKbootIdle,
    updateModuleFirmware,
    usbCommands: {
        getDeviceProperty       : 0x00,
        reenumerate             : 0x01,
        jumpToModuleBootloader  : 0x02,
        sendKbootCommandToModule: 0x03,
        readConfig              : 0x04,
        writeHardwareConfig     : 0x05,
        writeStagingUserConfig  : 0x06,
        applyConfig             : 0x07,
        launchEepromTransfer    : 0x08,
        getDeviceState          : 0x09,
        setTestLed              : 0x0a,
        getDebugBuffer          : 0x0b,
        getAdcValue             : 0x0c,
        setLedPwmBrightness     : 0x0d,
        getModuleProperty       : 0x0e,
        getSlaveI2cErrors       : 0x0f,
        setI2cBaudRate          : 0x10,
        switchKeymap            : 0x11,
    },
    enumerationModes: {
        bootloader: 0,
        buspal: 1,
        normalKeyboard: 2,
        compatibleKeyboard: 3,
    },
    enumerationModeIdToProductId: {
        '0': 0x6120,
        '1': 0x6121,
        '2': 0x6122,
        '3': 0x6123,
    },
    enumerationNameToProductId: {
        bootloader: 0x6120,
        buspal: 0x6121,
        normalKeyboard: 0x6122,
        compatibleKeyboard: 0x6123,
    },
    vendorId: 0x1D50,
    devicePropertyIds: {
        deviceProtocolVersion: 0,
        protocolVersions: 1,
        configSizes: 2,
        currentKbootCommand: 3,
        i2cBaudRate: 4,
        uptime: 5,
    },
    modulePropertyIds: {
        protocolVersions: 0,
    },
    configBufferIds,
    eepromOperations,
    eepromTransfer: {
        readHardwareConfig: {
            operation: eepromOperations.read,
            configBuffer: configBufferIds.hardwareConfig,
        },
        writeHardwareConfig: {
            operation: eepromOperations.write,
            configBuffer:configBufferIds.hardwareConfig,
        },
        readUserConfig: {
            operation: eepromOperations.read,
            configBuffer: configBufferIds.validatedUserConfig,
        },
        writeUserConfig: {
            operation: eepromOperations.write,
            configBuffer: configBufferIds.validatedUserConfig,
        },
    },
    kbootCommands: {
        idle: 0,
        ping: 1,
        reset: 2,
    },
    moduleSlotToI2cAddress: {
        leftHalf: '0x10',
        leftAddon: '0x20',
        rightAddon: '0x30',
    },
    moduleSlotToId: {
        leftHalf: 1,
        leftAddon: 2,
        rightAddon: 3,
    },
    leftLedDriverAddress: 0b1110100,
    rightLedDriverAddress: 0b1110111,
    sendLog: sendLog,
    readLog: readLog
};

function convertBufferToIntArray(buffer) {
    return Array.prototype.slice.call(buffer, 0)
}

function getTransferData(buffer) {
    // From HID API documentation:
    // http://www.signal11.us/oss/hidapi/hidapi/doxygen/html/group__API.html#gad14ea48e440cf5066df87cc6488493af
    // The first byte of data[] must contain the Report ID.
    // For devices which only support a single report, this must be set to 0x0.
    return [0, ...convertBufferToIntArray(buffer)];
}

function readLog(buffer) {
    writeLog('USB[R]: ', buffer)
}

function sendLog(buffer) {
    writeLog('USB[W]: ', buffer)
}

function writeLog(prefix, buffer) {
    if (!debug) {
        return;
    }
    console.log(prefix + bufferToString(buffer))
}

function checkModuleSlot(moduleSlot, mapping) {
    const mapped = mapping[moduleSlot];

    if (moduleSlot == undefined) {
        console.log(`No moduleSlot specified.`);
        process.exit(1);
    }

    if (mapped == undefined) {
        console.log(`Invalid moduleSlot "${moduleSlot}" specified.`);
        console.log(`Valid module slots are: ${Object.keys(mapping).join(', ')}.`);
        process.exit(1);
    }

    return mapped;
}
