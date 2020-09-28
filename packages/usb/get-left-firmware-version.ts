#!/usr/bin/env ../../node_modules/.bin/ts-node-script

import Uhk, { errorHandler, yargs } from './src';

(async function () {
    try {
        const argv = yargs
            .usage('Get Left firmware version')
            .argv;

        const { operations } = Uhk(argv);
        const version = await operations.getLeftModuleVersionInfo();

        console.log(`moduleProtocolVersion: ${version.moduleProtocolVersion}`);
        console.log(`firmwareVersion: ${version.firmwareVersion}`);
    } catch (error) {
        errorHandler(error);
    }
})();
