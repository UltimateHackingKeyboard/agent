#!/usr/bin/env ../../node_modules/.bin/ts-node-script

import Uhk, { errorHandler, yargs } from './src';
import { KbootCommands, ModuleSlotToId } from 'uhk-usb';

(async function () {
    try {
        const argv = yargs
            .scriptName('./send-kboot-command-to-module.ts')
            .usage('Usage: $0 <command> <moduleSlot> \n moduleSlot is always required, except for the idle command.')
            .demandCommand(1, 'Command required')
            .argv;

        const command = argv._[0];

        if (!Object.values(KbootCommands).includes(command)) {
            const keys = Object.keys(KbootCommands)
                .filter((key: any) => isNaN(key))
                .join(', ');
            console.error(`Valid commands: ${keys}`);
            process.exit(1);
        }

        const { device } = Uhk(argv);
        const module = argv._[1];

        if (KbootCommands[command] !== KbootCommands.idle) {
            if (!command) {
                const keys = Object.keys(ModuleSlotToId)
                    .filter((key: any) => isNaN(key))
                    .join(', ');
                console.error(`Command is not "idle" so must specify module: ${keys}`);
                process.exit(1);
            }

            if (!Object.values(ModuleSlotToId).includes(module)) {
                const keys = Object.keys(ModuleSlotToId)
                    .filter((key: any) => isNaN(key))
                    .join(', ');
                console.error(`The specified module does not exist. Specify one of ${keys}`);
                process.exit(1);
            }

            await device.sendKbootCommandToModule(ModuleSlotToId[module], KbootCommands[command]);

        } else {
            await device.sendKbootCommandToModule(undefined, KbootCommands.idle);
        }

    } catch (error) {
        errorHandler(error);
    }
})();
