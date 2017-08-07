let usb = require('usb');
let receiveCallback;

function bufferToString(buffer) {
    let str = '';
    for (let i = 0; i < buffer.length; i++) {
        let hex = buffer[i].toString(16) + ' ';
        if (hex.length <= 2) {
            hex = '0' + hex;
        }
        str += hex;
    };
    return str;
}

let usbEndpoints;

function getUhkDevice() {
    return usb.findByIds(0x1d50, 0x6122);
}

function getBootloaderDevice() {
    return usb.findByIds(0x1d50, 0x6120);
}

function getUsbEndpoints() {
    let device = getUhkDevice();
    device = getUhkDevice();
    device.open();

    let usbInterface = device.interface(0);

    // https://github.com/tessel/node-usb/issues/147
    // The function 'isKernelDriverActive' is not available on Windows and not even needed.
    if (process.platform !== 'win32' && usbInterface.isKernelDriverActive()) {
        usbInterface.detachKernelDriver();
    }
    usbInterface.claim();

    let endpointIn = usbInterface.endpoints[0];
    let endpointOut = usbInterface.endpoints[1];
    return [endpointIn, endpointOut];
}

class DelayMs {
    constructor(ms) {
        this.ms = ms;
    }
}

function registerReceiveCallback(receiveCallbackParam) {
    receiveCallback = receiveCallbackParam;
}

function sendUsbPacketsByCallback(packetProvider, options={}) {
    let packet = packetProvider()

    if (packet instanceof DelayMs) {
        setTimeout(() => {
            sendUsbPacketsByCallback(packetProvider);
        }, packet.ms);
        return;
    }

    if (!(packet instanceof Buffer)) {
        return;
    }

    console.log('Sending: ', bufferToString(packet));

    let [endpointIn, endpointOut] = usbEndpoints || getUsbEndpoints();
    endpointOut.transfer(packet, function(err) {
        if (err) {
            console.error("USB error: %s", err);
            process.exit(1);
        }

        if (options.noReceive) {
            sendUsbPacketsByCallback(packetProvider);
        } else {
            endpointIn.transfer(64, function(err2, receivedBuffer) {
                if (err2) {
                    console.error("USB error: %s", err2);
                    process.exit(2);
                }
                console.log('Received:', bufferToString(receivedBuffer));
                (receiveCallback || (()=>{}))(receivedBuffer);
                sendUsbPacketsByCallback(packetProvider);
            })
        }

    })
}

function sendUsbPacket(packet, options={}) {
    sendUsbPackets([packet], options);
}

function sendUsbPackets(packets, options={}) {
    sendUsbPacketsByCallback(() => {
        return packets.shift();
    }, options)
}

exports = module.exports = {
    DelayMs,
    bufferToString,
    getUhkDevice,
    getBootloaderDevice,
    getUsbEndpoints,
    registerReceiveCallback,
    sendUsbPacket,
    sendUsbPackets,
    sendUsbPacketsByCallback,
    usbCommands: {
        getProperty: 0,
        jumpToBootloader: 1,
        setTestLed: 2,
        writeLedDriver: 3,
        readLedDriver: 4,
        writeEeprom: 5,
        readEeprom: 6,
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
    leftLedDriverAddress: 0b1110100,
    rightLedDriverAddress: 0b1110111
}
