#!/usr/bin/env ts-node-script

import Uhk, { errorHandler, yargs } from './src';
import * as fs from 'fs';

(async () => {
    try {
        const argv = yargs
            .scriptName('./write-user-config.ts')
            .usage('Usage: $0 <configPath>')
            .demandCommand(1, 'User configuration path is required.')
            .argv;

        const configPath = argv._[0];

        if (!fs.existsSync(configPath)) {
            console.error('User configuration path is not exists');
            process.exit(1);
        }

        const { operations } = Uhk(argv);
        const configBuffer = fs.readFileSync(configPath) as any;
        await operations.saveUserConfiguration(configBuffer);

    } catch (error) {
        errorHandler(error);
    }
})();
