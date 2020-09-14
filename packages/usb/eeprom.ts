#!/usr/bin/env ts-node-script

import Uhk, { errorHandler, yargs } from './src';
import { ConfigBufferId, EepromOperation } from 'uhk-usb';

(async function () {
    try {
        const argv = yargs
            .scriptName('./eeprom.ts')
            .usage('Usage: $0 <read | write> <hardwareConfig | stagingUserConfig | validatedUserConfig>')
            .demandCommand(2, 'Operation and buffer identifier are required')
            .argv;

        const { operations } = Uhk(argv);
        const operation = mapOperation(argv._[0]);
        await operations.launchEepromTransfer(operation, mapBufferId(argv._[1]));
    } catch (error) {
        errorHandler(error);
    }
})();

function mapOperation(operation: string): EepromOperation {
    switch (operation) {
        case 'read':
            return EepromOperation.read;

        case 'write':
            return EepromOperation.write;

        default:
            console.error('Invalid operation: Gotta provide one of <read | write>');
            process.exit(1);
            break;

    }
}

function mapBufferId(bufferId: string): ConfigBufferId {
    switch (bufferId) {
        case 'hardwareConfig':
            return ConfigBufferId.hardwareConfig;

        case 'stagingUserConfig':
            return ConfigBufferId.stagingUserConfig;

        case 'validatedUserConfig':
            return ConfigBufferId.validatedUserConfig;

        default:
            console.error('Invalid bufferId: Gotta provide one of <hardwareConfig | stagingUserConfig | validatedUserConfig>');
            process.exit(1);
            break;
    }
}
