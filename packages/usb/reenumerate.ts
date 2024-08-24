#!/usr/bin/env -S node --loader ts-node/esm --no-warnings=ExperimentalWarning

import Uhk, { errorHandler, yargs } from './src/index.js';
import {
    EnumerationModes,
    getCurrentUhkDeviceProduct,
    getDeviceEnumerateProductId
} from 'uhk-usb';

(async function () {
    try {
        const argv = yargs
            .scriptName('./reenumerate.ts')
            .usage('Usage: $0 <mode>')
            .demandCommand(1, 'Reenumeration mode required')
            .option('timeout', {
                type: 'number',
                description: 'Enumeration timeout',
                default: 5000,
                alias: 't'
            })
            .argv;

        const mode = argv._[0];

        if (!Object.values(EnumerationModes).includes(mode)) {
            const keys = Object.keys(EnumerationModes)
                .filter((key: any) => isNaN(key))
                .join(', ');
            console.error(`The specified enumeration mode does not exist. Specify one of ${keys}`);
            process.exit(1);
        }
        const enumerationMode = EnumerationModes[mode];
        const uhkDeviceProduct = await getCurrentUhkDeviceProduct();
        const enumerationProductId = getDeviceEnumerateProductId(uhkDeviceProduct, enumerationMode);

        const { device } = Uhk(argv);
        await device.reenumerate({
            enumerationMode,
            vendorId: uhkDeviceProduct.vendorId,
            productId: enumerationProductId,
            timeout: argv.timeout});
    } catch (error) {
        errorHandler(error);
    }
})();
