#!/usr/bin/env ../../node_modules/.bin/ts-node-script

import Uhk, { errorHandler, yargs } from './src';
import { ModuleSlotToId } from 'uhk-usb';

(async function () {
    try {
        const argv = yargs
            .scriptName('./jump-to-module-bootloader.ts')
            .usage('Usage: $0 <module>')
            .demandCommand(1, 'Module required')
            .argv;

        const module = argv._[0];

        if (!Object.values(ModuleSlotToId).includes(module)) {
            const keys = Object.keys(ModuleSlotToId)
                .filter((key: any) => isNaN(key))
                .join(', ');
            console.error(`The specified module does not exist. Specify one of ${keys}`);
            process.exit(1);
        }

        const { operations } = Uhk(argv);
        await operations.jumpToBootloaderModule(ModuleSlotToId[module]);
    } catch (error) {
        errorHandler(error);
    }
})();
