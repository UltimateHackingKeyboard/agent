#!/usr/bin/env ../../node_modules/.bin/ts-node-script

import * as path from 'path';
import Uhk, { errorHandler, yargs } from './src';

(async function () {
    try {
        const argv = yargs
            .usage('Upgrade firmwares')
            .argv;

        const { operations } = Uhk(argv);
        const firmwareDir = path.join('../../tmp/packages/firmware');
        const rightFirmwarePath = path.join(firmwareDir, 'devices/uhk60-right/firmware.hex');
        await operations.updateRightFirmwareWithKboot(rightFirmwarePath);
        const leftFirmwarePath = path.join(firmwareDir, 'modules/uhk60-left.bin');
        await operations.updateLeftModuleWithKboot(leftFirmwarePath);
    } catch (error) {
        errorHandler(error);
    }
})();
