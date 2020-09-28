#!/usr/bin/env ../../node_modules/.bin/ts-node-script

import Uhk, { errorHandler, yargs } from './src';

(async function () {
    try {
        const argv = yargs
            .scriptName('./get-slave-i2c-errors.ts')
            .usage('Usage: $0 <module ID>')
            .demandCommand(1, 'Module id required')
            .argv;

        const { operations } = Uhk(argv);
        const slaveErrors = await operations.getI2cSlaveErrors(parseInt(argv._[0]));

        if (!slaveErrors.isExists) {
            console.log('Invalid slave id');
            process.exit(1);
        }

        let str = `${slaveErrors.slave.name.padEnd(14)}: `;

        slaveErrors.statuses.forEach(error => {
            str += `${error.name}:${error.count} `;
        });

        console.log(str);
    } catch (error) {
        errorHandler(error);
    }
})();
