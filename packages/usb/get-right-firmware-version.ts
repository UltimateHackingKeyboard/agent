#!/usr/bin/env -S node --loader ts-node/esm --no-warnings=ExperimentalWarning

import Uhk, { errorHandler, yargs } from './src/index.js';

(async function () {
    try {
        const argv = yargs
            .usage('Get Right firmware version')
            .argv;

        const { operations } = Uhk(argv);
        const version = await operations.getDeviceVersionInfo();

        console.log(`firmwareVersion: ${version.firmwareVersion}`);
        console.log(`deviceProtocolVersion: ${version.deviceProtocolVersion}`);
        console.log(`moduleProtocolVersion: ${version.moduleProtocolVersion}`);
        console.log(`userConfigVersion: ${version.userConfigVersion}`);
        console.log(`hardwareConfigVersion: ${version.hardwareConfigVersion}`);
        console.log(`smartMacrosVersion: ${version.smartMacrosVersion}`);
        console.log(`firmwareGitRepo: ${version.firmwareGitRepo}`);
        console.log(`firmwareGitTag: ${version.firmwareGitTag}`);
        console.log(`firmwareChecksum: ${version.firmwareChecksum}`);
    } catch (error) {
        await errorHandler(error);
    }
})();
