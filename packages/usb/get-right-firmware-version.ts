#!/usr/bin/env -S node --loader ts-node/esm --no-warnings=ExperimentalWarning

import Uhk, { errorHandler, yargs } from './src/index.js';

(async function () {
    try {
        const argv = yargs
            .usage('Get Left firmware version')
            .argv;

        const { operations } = Uhk(argv);
        const version = await operations.getRightModuleVersionInfo();

        console.log(`firmwareVersion: ${version.firmwareVersion}`);
        console.log(`deviceProtocolVersion: ${version.deviceProtocolVersion}`);
        console.log(`moduleProtocolVersion: ${version.moduleProtocolVersion}`);
        console.log(`userConfigVersion: ${version.userConfigVersion}`);
        console.log(`hardwareConfigVersion: ${version.hardwareConfigVersion}`);
        console.log(`smartMacrosVersion: ${version.smartMacrosVersion}`);
    } catch (error) {
        errorHandler(error);
    }
})();
