#!/usr/bin/env -S node --loader ts-node/esm --no-warnings=ExperimentalWarning

import { join } from 'desm';
import { spawn } from 'node:child_process';
import process from 'node:process';
import { setTimeout } from 'node:timers/promises';
import { LogService } from 'uhk-common'
import {
    EnumerationModes,
    getCurrentUhkDeviceProduct,
    listAvailableDevices,
    UhkHidDevice,
} from 'uhk-usb';

import Uhk, { yargs } from './src/index.js';

class TimeStampLogService extends LogService {
    protected log(...args: any[]): void {
        console.log(new Date().toISOString(), ...args);
    }
}

const logService = new TimeStampLogService()
if (process.argv[2] === 'list') {
    let run = true
    while (run) {
        try {
            await listAvailableDevices({
                logService,
                showUnchangedMsg: false,
            });
            await setTimeout(250)
        }
        catch (error) {
            logService.error(error);
        }
    }
    process.on('SIGTERM', () => {
        run = false;
    })
}
else {
   const argv = yargs
        .scriptName('./investigate-reenumeration.ts')
        .usage('Usage: $0')
        .argv;

    const child = spawn('node', ['--loader', 'ts-node/esm', '--no-warnings=ExperimentalWarning', import.meta.filename, 'list'], { stdio: 'pipe' });
    child.stdout.on('data', (data) => {
        console.log(data.toString());
    });

    child.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });

    child.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
    });
    process.on('SIGTERM', ()=> {
        child.kill('SIGTERM');
    })

    await listAvailableDevices({
        logService,
        showUnchangedMsg: false,
    });
    const uhkDeviceProduct = await getCurrentUhkDeviceProduct(argv);

    const rootDir = join(import.meta.url, '../../tmp');
    const device = new UhkHidDevice(logService, argv, rootDir);
    logService.misc('Start reenumeration')
    await device.reenumerate({
        device: uhkDeviceProduct,
        enumerationMode: EnumerationModes.Bootloader,
    });
    logService.misc('End reenumeration')

    logService.misc('Start 10s wait')
    await setTimeout(10000)
    logService.misc('End 10s wait')
    child.kill('SIGTERM');
}
