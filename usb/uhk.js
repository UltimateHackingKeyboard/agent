let usb = require('usb');

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

function getUsbEndpoints() {
    let vid = 0x16d3;
    let pid = 0x05ea;

    let device = usb.findByIds(vid, pid);
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

function sendUsbPacket(packet) {
    console.log('Sending: ', bufferToString(packet));

    let [endpointIn, endpointOut] = usbEndpoints || getUsbEndpoints();
    endpointOut.transfer(packet, function(err) {
        if (err) {
            console.error("USB error: %s", err);
            process.exit(1);
        }
        endpointIn.transfer(64, function(err2, receivedBuffer) {
            if (err2) {
                console.error("USB error: %s", err2);
                process.exit(2);
            }
            console.log('Received:', bufferToString(receivedBuffer));
        })
    })
}

exports = module.exports = {
    bufferToString,
    getUsbEndpoints,
    sendUsbPacket,
    usbCommands: {
        getProperty: 0,
        jumpToBootloader: 1,
        setTestLed: 2,
        writeLedDriver: 3,
        readLedDriver: 4,
        writeEeprom: 5,
        readEeprom: 6,
        readMergeSensor: 7,
        uploadConfig: 8,
        applyConfig: 9,
        setLedPwm: 10
    },
}
