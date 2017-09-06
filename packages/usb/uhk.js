const HID = require('node-hid');

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
        console.error('UHK Device not found:');
        return null;
    }

    return new HID.HID(foundDevice.path);
}

function getBootloaderDevice() {
    const foundDevice = HID.devices().find(device =>
        device.vendorId === 0x1d50 && device.productId === 0x6120);

    if (!foundDevice) {
        console.error('UHK Bootloader not found:');
        return null;
    } else {
        console.info(foundDevice);
    }

    return new HID.HID(foundDevice.path);
}

exports = module.exports = moduleExports = {
    bufferToString,
    getUhkDevice,
    getBootloaderDevice,
    getTransferData,
    usbCommands: {
        getProperty: 0,
        jumpToBootloader: 1,
        setTestLed: 2,
        readMergeSensor: 7,
        writeUserConfig: 8,
        applyConfig: 9,
        setLedPwm: 10,
        readAdc: 11,
        launchEepromTransfer: 12,
        readHardwareConfig: 13,
        writeHardwareConfig: 14,
        readUserConfig: 15,
        getKeyboardState: 16,
        readDebugInfo: 17,
    },
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
    leftLedDriverAddress: 0b1110100,
    rightLedDriverAddress: 0b1110111
}

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
