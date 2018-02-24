#!/usr/bin/env node
const uhk = require('./uhk');
const device = uhk.getUhkDevice();

function getUint32(buffer, offset) {
    return (buffer[offset]) + (buffer[offset+1] << 8) + (buffer[offset+2] << 16) + (buffer[offset+3] << 24);
}

function getUint16(buffer, offset) {
    return (buffer[offset]) + (buffer[offset+1] << 8);
}

let prevGeneric, prevBasic, prevMedia, prevSystem, prevMouse;
function getDebugInfo() {

    const payload = new Buffer([uhk.usbCommands.getDebugBuffer]);
    console.log(payload)
    console.log('Sending ', uhk.bufferToString(payload));
    device.write(uhk.getTransferData(payload));
    const rxBuffer = Buffer.from(device.readSync());
    console.log('Received', uhk.bufferToString(rxBuffer));

    const I2C_Watchdog = getUint32(rxBuffer, 1);
    const I2cSlaveScheduler_Counter = getUint32(rxBuffer, 5);
    const I2cWatchdog_WatchCounter = getUint32(rxBuffer, 9);
    const I2cWatchdog_RecoveryCounter = getUint32(rxBuffer, 13);
    const KeyScannerCounter = getUint32(rxBuffer, 17);
    const UsbReportUpdateCounter = getUint32(rxBuffer, 21);
    const CurrentTime = getUint32(rxBuffer, 25);
    const UsbGenericHidActionCounter = getUint32(rxBuffer, 29);
    const UsbBasicKeyboardActionCounter = getUint32(rxBuffer, 33);
    const UsbMediaKeyboardActionCounter = getUint32(rxBuffer, 37);
    const UsbSystemKeyboardActionCounter = getUint32(rxBuffer, 41);
    const UsbMouseActionCounter = getUint32(rxBuffer, 45);

    process.stdout.write(`I2C_Watchdog:${I2C_Watchdog} | `);
    process.stdout.write(`I2cSlaveScheduler_Counter:${I2cSlaveScheduler_Counter} | `);
    process.stdout.write(`I2cWatchdog_WatchCounter:${I2cWatchdog_WatchCounter} | `);
    process.stdout.write(`I2cWatchdog_RecoveryCounter:${I2cWatchdog_RecoveryCounter} | `);
    process.stdout.write(`KeyScannerCounter:${KeyScannerCounter} | `);
    process.stdout.write(`UsbReportUpdateCounter:${UsbReportUpdateCounter} | `);
    process.stdout.write(`CurrentTime:${CurrentTime} | `);
    process.stdout.write(`UsbGenericHidActionCounter:${UsbGenericHidActionCounter} | `);
    process.stdout.write(`UsbBasicKeyboardActionCounter:${UsbBasicKeyboardActionCounter} | `);
    process.stdout.write(`UsbMediaKeyboardActionCounter:${UsbMediaKeyboardActionCounter} | `);
    process.stdout.write(`UsbSystemKeyboardActionCounter:${UsbSystemKeyboardActionCounter} | `);
    process.stdout.write(`UsbMouseActionCounter:${UsbMouseActionCounter} | `);
    process.stdout.write('\n');

    process.stdout.write(`generic:${UsbGenericHidActionCounter - prevGeneric} `)
    process.stdout.write(`basic:${UsbBasicKeyboardActionCounter - prevBasic} `)
    process.stdout.write(`basic:${UsbMediaKeyboardActionCounter - prevMedia} `)
    process.stdout.write(`basic:${UsbSystemKeyboardActionCounter - prevSystem} `)
    process.stdout.write(`basic:${UsbMouseActionCounter - prevMouse} `)

    prevGeneric = UsbGenericHidActionCounter;
    prevBasic = UsbBasicKeyboardActionCounter;
    prevMedia = UsbMediaKeyboardActionCounter;
    prevSystem = UsbSystemKeyboardActionCounter;
    prevMouse = UsbMouseActionCounter;

    setTimeout(getDebugInfo, 1000);
}

getDebugInfo();
