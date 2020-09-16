#!/usr/bin/env ts-node-script

import Uhk, { errorHandler, yargs } from './src';

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
    } catch (error) {
        errorHandler(error);
    }
})();
