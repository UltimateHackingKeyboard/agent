#!/usr/bin/env ts-node-script

import Uhk, { errorHandler, yargs } from './src';

const argv = yargs
    .usage('Periodically query the debug info')
    .argv;

const { operations } = Uhk(argv);

let prevGeneric, prevBasic, prevMedia, prevSystem, prevMouse;

setInterval(async function () {
    try {

        const debugInfo = await operations.getDebugInfo();

        process.stdout.write(`I2cWatchdog:${debugInfo.i2cWatchdog} | `);
        process.stdout.write(`I2cSlave:${debugInfo.i2cSlaveSchedulerCounter} | `);
        process.stdout.write(`I2cWatch:${debugInfo.i2cWatchdog} | `);
        process.stdout.write(`I2cRecovery:${debugInfo.i2cWatchdogRecoveryCounter} | `);
        process.stdout.write(`KeyMatrix:${debugInfo.keyScannerCounter} | `);
        process.stdout.write(`UsbReport:${debugInfo.usbReportUpdateCounter} | `);
        process.stdout.write(`Time:${debugInfo.currentTime} | `);
        process.stdout.write(`UsbGeneric:${debugInfo.usbGenericHidActionCounter} | `);
        process.stdout.write(`UsbBasic:${debugInfo.usbBasicKeyboardActionCounter} | `);
        process.stdout.write(`UsbMedia:${debugInfo.usbMediaKeyboardActionCounter} | `);
        process.stdout.write(`UsbSystem:${debugInfo.usbSystemKeyboardActionCounter} | `);
        process.stdout.write(`UsbMouse:${debugInfo.usbMouseActionCounter}`);
        process.stdout.write('\n');

        //    process.stdout.write(`generic:${debugInfo.usbGenericHidActionCounter - prevGeneric} `)
        //    process.stdout.write(`basic:${debugInfo.usbBasicKeyboardActionCounter - prevBasic} `)
        //    process.stdout.write(`basic:${debugInfo.usbMediaKeyboardActionCounter - prevMedia} `)
        //    process.stdout.write(`basic:${debugInfo.usbSystemKeyboardActionCounter - prevSystem} `)
        //    process.stdout.write(`basic:${debugInfo.usbMouseActionCounter - prevMouse} `)

        prevGeneric = debugInfo.usbGenericHidActionCounter;
        prevBasic = debugInfo.usbBasicKeyboardActionCounter;
        prevMedia = debugInfo.usbMediaKeyboardActionCounter;
        prevSystem = debugInfo.usbSystemKeyboardActionCounter;
        prevMouse = debugInfo.usbMouseActionCounter;
    } catch (error) {
        errorHandler(error);
    }
}, 500);
