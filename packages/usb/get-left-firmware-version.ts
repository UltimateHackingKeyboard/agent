#!/usr/bin/env ../../node_modules/.bin/ts-node-esm

import { ModuleSlotToId } from 'uhk-common';

import Uhk, { errorHandler, yargs } from './src/index.js';

(async function () {
    try {
        const argv = yargs
            .usage('Get Left firmware version')
            .argv;

        const { operations } = Uhk(argv);
        const version = await operations.getModuleVersionInfo(ModuleSlotToId.leftHalf);

        console.log(`moduleProtocolVersion: ${version.moduleProtocolVersion}`);
        console.log(`firmwareVersion: ${version.firmwareVersion}`);
    } catch (error) {
        errorHandler(error);
    }
})();
