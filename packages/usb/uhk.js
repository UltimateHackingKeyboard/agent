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

exports = module.exports = moduleExports = {
    bufferToString,
    getUhkDevice,
    getBootloaderDevice,
    getTransferData,
    checkModuleSlot,
    usbCommands: {
        getProperty: 0,
        reenumerate: 1,
        setTestLed: 0x14,
        writeUserConfig: 8,
        applyConfig: 9,
        setLedPwmBrightness: 10,
        getAdcValue: 11,
        launchEepromTransferLegacy: 12,
        readHardwareConfig: 13,
        writeHardwareConfig: 14,
        readUserConfig: 15,
        getKeyboardState: 16,
        getDebugInfo: 17,
        jumpToModuleBootloader: 18,
        sendKbootCommandToModule: 19,
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
    systemPropertyIds: {
        usbProtocolVersion: 0,
        bridgeProtocolVersion: 1,
        dataModelVersion: 2,
        firmwareVersion: 3,
        hardwareConfigSize: 4,
        userConfigSize: 5,
    },
    eepromTransfer: {
        readHardwareConfig: 0,
        writeHardwareConfig: 1,
        readUserConfig: 2,
        writeUserConfig: 3,
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
    const data = convertBufferToIntArray(buffer)
    // if data start with 0 need to add additional leading zero because HID API remove it.
    // https://github.com/node-hid/node-hid/issues/187
    if (data.length > 0 && data[0] === 0) {
//        data.unshift(0)  // TODO: This has been commented out because it causes bugs on Linux and Mac. Gotta test it on Windows and fully remove it if possible.
    }

    // From HID API documentation:
    // http://www.signal11.us/oss/hidapi/hidapi/doxygen/html/group__API.html#gad14ea48e440cf5066df87cc6488493af
    // The first byte of data[] must contain the Report ID.
    // For devices which only support a single report, this must be set to 0x0.
    data.unshift(0)

    return data
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
