#!/usr/bin/env -S node --loader ts-node/esm --no-warnings=ExperimentalWarning

import {
    isDeviceProtocolSupportFirmwareChecksum,
    isDeviceProtocolSupportGitInfo,
    ModuleSlotToId
} from 'uhk-common';

import Uhk, { errorHandler, yargs } from './src/index.js';

(async function () {
    try {
        const argv = yargs
            .usage('Get module state')
            .argv;

        const { operations } = Uhk(argv);
        const rightModuleInfo = await operations.getDeviceVersionInfo();
        const isGitInfoSupported = isDeviceProtocolSupportGitInfo(rightModuleInfo.deviceProtocolVersion);
        const isFirmwareChecksum = isDeviceProtocolSupportFirmwareChecksum(rightModuleInfo.deviceProtocolVersion);
        const info = await operations.getModuleVersionInfo(
            ModuleSlotToId.leftHalf,
            isGitInfoSupported,
            isFirmwareChecksum
        );
        console.log(info);
    } catch (error) {
        await errorHandler(error);
    }
})();
