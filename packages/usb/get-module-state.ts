#!/usr/bin/env ../../node_modules/.bin/ts-node-script

import { ModuleSlotToId } from 'uhk-usb';

import Uhk, { errorHandler, yargs } from './src';

(async function () {
    try {
        const argv = yargs
            .usage('Get module state')
            .argv;

        const { operations } = Uhk(argv);
        const info = await operations.getModuleVersionInfo(ModuleSlotToId.leftHalf);
        console.log(info);
    } catch (error) {
        errorHandler(error);
    }
})();
