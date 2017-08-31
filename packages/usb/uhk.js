let usb = require('usb')
const HID = require('node-hid')
let receiveCallback

function bufferToString (buffer) {
    let str = ''
    for (let i = 0; i < buffer.length; i++) {
        let hex = buffer[i].toString(16) + ' '
        if (hex.length <= 2) {
            hex = '0' + hex
        }
        str += hex
    }

    return str
}

let usbEndpoints

function getUhkDevice () {
    const devs = HID.devices()

    const dev = devs.find(x =>
        x.vendorId === 0x1d50 &&
        x.productId === 0x6122 &&
        ((x.usagePage === 128 && x.usage === 129) || x.interface === 0))

    if (!dev) {
        console.error('UHK Device not found:')
        return null
    }

    return new HID.HID(dev.path)
}

function getBootloaderDevice () {
    const devs = HID.devices()

    const dev = devs.find(x =>
        x.vendorId === 0x1d50 &&
        x.productId === 0x6120)

    if (!dev) {
        console.error('UHK Bootloader not found:')
        return null
    }
    else {
        console.info(dev)
    }

    return new HID.HID(dev.path)
}

function getUsbEndpoints () {
    let device = getUhkDevice()
    device = getUhkDevice()
    device.open()

    let usbInterface = device.interface(0)

    // https://github.com/tessel/node-usb/issues/147
    // The function 'isKernelDriverActive' is not available on Windows and not even needed.
    if (process.platform !== 'win32' && usbInterface.isKernelDriverActive()) {
        usbInterface.detachKernelDriver()
    }
    usbInterface.claim()

    let endpointIn = usbInterface.endpoints[0]
    let endpointOut = usbInterface.endpoints[1]
    return [endpointIn, endpointOut]
}

class DelayMs{
    constructor (ms) {
        this.ms = ms
    }
}

function registerReceiveCallback (receiveCallbackParam) {
    receiveCallback = receiveCallbackParam
}

function sendUsbPacketsByCallback (packetProvider, options = {}) {
    let packet = packetProvider()

    if (packet instanceof DelayMs) {
        setTimeout(() => {
            sendUsbPacketsByCallback(packetProvider)
        }, packet.ms)
        return
    }

    if (!(packet instanceof Buffer)) {
        return
    }

    if (!moduleExports.silent) {
        console.log('Sending: ', bufferToString(packet))
    }

    let [endpointIn, endpointOut] = usbEndpoints || getUsbEndpoints()
    endpointOut.transfer(packet, function (err) {
        if (err) {
            console.error('USB error: %s', err)
            process.exit(1)
        }

        if (options.noReceive) {
            sendUsbPacketsByCallback(packetProvider)
        } else {
            endpointIn.transfer(64, function (err2, receivedBuffer) {
                if (err2) {
                    console.error('USB error: %s', err2)
                    process.exit(2)
                }
                if (!moduleExports.silent) {
                    console.log('Received:', bufferToString(receivedBuffer))
                }
                (receiveCallback || (() => {}))(receivedBuffer)
                sendUsbPacketsByCallback(packetProvider)
            })
        }

    })
}

function sendUsbPacket2 (device, packet) {
    device.on('data', (data) => {
        console.log('data: ', data)
    })
    device.on('error', (data) => {
        console.log('error: ', data)
    })
    device.read((err, data) => {
        console.log('read: ', err, data)
    })
    device.write(getTransferData(packet))

}

function sendUsbPacket (packet, options = {}) {
    sendUsbPackets([packet], options)
}

function sendUsbPackets (packets, options = {}) {
    sendUsbPacketsByCallback(() => {
        return packets.shift()
    }, options)
}

exports = module.exports = moduleExports = {
    DelayMs,
    bufferToString,
    getUhkDevice,
    getBootloaderDevice,
    getUsbEndpoints,
    registerReceiveCallback,
    sendUsbPacket,
    sendUsbPacket2,
    sendUsbPackets,
    sendUsbPacketsByCallback,
    getTransferData,
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
    eepromTransfer: {
        readHardwareConfig: 0,
        writeHardwareConfig: 1,
        readUserConfig: 2,
        writeUserConfig: 3,
    },
    leftLedDriverAddress: 0b1110100,
    rightLedDriverAddress: 0b1110111
}

function convertBufferToIntArray (buffer) {
    return Array.prototype.slice.call(buffer, 0)
}

function getTransferData (buffer) {
    const data = convertBufferToIntArray(buffer)
    // if data start with 0 need to add additional leading zero because HID API remove it.
    // https://github.com/node-hid/node-hid/issues/187
    if (data.length > 0 && data[0] === 0) {
        data.unshift(0)
    }

    // From HID API documentation:
    // http://www.signal11.us/oss/hidapi/hidapi/doxygen/html/group__API.html#gad14ea48e440cf5066df87cc6488493af
    // The first byte of data[] must contain the Report ID.
    // For devices which only support a single report, this must be set to 0x0.
    data.unshift(0)

    return data
}
