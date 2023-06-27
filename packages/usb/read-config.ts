#!/usr/bin/env -S node --loader ts-node/esm --no-warnings=ExperimentalWarning

import * as fs from 'fs';
import { Buffer } from 'uhk-common';
import { ConfigBufferId, bufferToString } from 'uhk-usb';
import Uhk, { errorHandler, yargs } from './src/index.js';

(async function () {
    try {
        const argv = yargs
            .usage('Read configuration')
            .argv;

        const isHardwareConfig = argv._[0] === 'h';

        const { operations } = Uhk(argv);
        const configSizes = await operations.getConfigSizesFromKeyboard();
        let config: Buffer;
        let fileName: string;

        if (isHardwareConfig) {
            console.log('hardwareConfigSize:', configSizes.hardwareConfig);
            config = await operations.loadConfiguration(ConfigBufferId.hardwareConfig);
            fileName = 'hardware-config.read';
        } else {
            console.log('userConfigSize:', configSizes.userConfig);
            config = await operations.loadConfiguration(ConfigBufferId.validatedUserConfig);
            fileName = 'user-config.read';
        }

        console.log('read ', bufferToString(config));
        fs.writeFileSync(fileName, config);
    } catch (error) {
        errorHandler(error);
    }
})();
