#!/usr/bin/env ts-node-script

import Uhk, { errorHandler, yargs } from './src';
import * as path from 'path';
import * as fs from 'fs';

(async () => {
    try {
        const argv = yargs
            .scriptName('./update-firmwares-and-configs.ts')
            .usage('Usage: $0 <firmware directory> {iso|ansi}')
            .demandCommand(2, 'Both firmwarePath and layout must be specified.')
            .argv as any;

        const firmwarePath = argv._[0];
        const layout = argv._[1];

        if (!fs.existsSync(firmwarePath)) {
            console.log('Firmware directory does not exists.');
            process.exit(1);
        }

        const rightFirmwarePath = path.join(firmwarePath, '/devices/uhk60-right/firmware.hex');
        if (!fs.existsSync(rightFirmwarePath)) {
            console.error('Right firmware path not found!');
            process.exit(1);
        }

        const leftFirmwarePath = path.join(firmwarePath, '/modules/uhk60-left.bin');
        if (!fs.existsSync(leftFirmwarePath)) {
            console.error('Left firmware path not found!');
            process.exit(1);
        }

        const userConfigPath = path.join(firmwarePath, '/devices/uhk60-right/config.bin');
        if (!fs.existsSync(userConfigPath)) {
            console.error('User configuration path not found!');
            process.exit(1);
        }

        if (!['ansi', 'iso'].includes(layout)) {
            console.error('The specified layout is neither ansi nor iso.');
            process.exit(1);
        }

        const { operations } = Uhk(argv);
        await operations.updateRightFirmwareWithKboot(rightFirmwarePath);
        await operations.updateLeftModuleWithKboot(leftFirmwarePath);
        const configBuffer = fs.readFileSync(userConfigPath) as any;
        await operations.saveUserConfiguration(configBuffer);
        await operations.saveHardwareConfiguration(layout === 'iso');

    } catch (error) {
        errorHandler(error);
    }
})();
