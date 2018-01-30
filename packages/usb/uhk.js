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

let configBufferIds = {
    hardwareConfig: 0,
    stagingUserConfig: 1,
    validatedUserConfig: 2,
};

let eepromOperations = {
    read: 0,
    write: 1,
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
            const enumerationModes = Object.keys(uhk.enumerationModes).join(', ');
            console.log(`Invalid enumeration mode '${enumerationMode}' is not one of: ${enumerationModes}`);
            reject();
            return;
        }

        console.log(`Trying to reenumerate as ${enumerationMode}...`);
        const intervalId = setInterval(() => {
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
                let message = new Buffer([exports.usbCommands.reenumerate, enumerationModeId, ...uint32ToArray(bootloaderTimeoutMs)]);
                device.write(getTransferData(message));
                jumped = true;
            }

        }, pollingIntervalMs);
    })
};

exports = module.exports = moduleExports = {
    bufferToString,
    getUint16,
    getUint32,
    uint32ToArray,
    writeDevice,
    getUhkDevice,
    getBootloaderDevice,
    getTransferData,
    checkModuleSlot,
    reenumerate,
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
