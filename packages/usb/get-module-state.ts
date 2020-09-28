#!/usr/bin/env ../../node_modules/.bin/ts-node-script

import { ModuleSlotToId } from 'uhk-usb';

import Uhk, { errorHandler, yargs } from './src';

(async function () {
    try {
        const argv = yargs
            .usage('Get module state')
            .argv;

        const { operations } = Uhk(argv);
        await operations.getModuleVersionInfo(ModuleSlotToId.leftHalf);
    } catch (error) {
        errorHandler(error);
    }
})();
