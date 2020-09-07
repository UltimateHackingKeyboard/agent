#!/usr/bin/env ts-node

import Uhk from './src/uhk';

const uhk = Uhk();
uhk.operations
    .getConfigSizesFromKeyboard()
    .then(configs => {
        console.log(`hardwareConfigMaxSize: ${configs.hardwareConfig}`);
        console.log(`userConfigMaxSize: ${configs.userConfig}`);
    })
    .catch(uhk.logger.error);
