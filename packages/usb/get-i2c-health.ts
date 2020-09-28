#!/usr/bin/env ../../node_modules/.bin/ts-node-script

import Uhk, { errorHandler, yargs } from './src';

(async function () {
    try {
        const argv = yargs
            .usage('Get I2C Health')
            .argv;

        const { operations } = Uhk(argv);

        const uptime = await operations.getUptime();
        // tslint:disable-next-line:max-line-length
        console.log(`uptime: ${uptime.days}d ${uptime.hours.toString(10).padStart(2, '')}:${uptime.minutes.toString(10).padStart(2, '')}:${uptime.seconds.toString(10).padStart(2, '')}`);

        const baudRate = await operations.getI2CBaudRate();
        // tslint:disable-next-line:max-line-length
        console.log(`requestedBaudRate:${baudRate.requestedBaudRate} | actualBaudRate:${baudRate.actualBaudRate} | I2C0_F:0b${baudRate.i2c0F}`);

        for (let slaveId = 0; slaveId < 6; slaveId++) {
            const slaveErrors = await operations.getI2cSlaveErrors(slaveId);
            let str = `${slaveErrors.slave.name.padEnd(14)}: `;

            slaveErrors.statuses.forEach(error => {
                str += `${error.name}:${error.count} `;
            });

            console.log(str);
        }
    } catch (error) {
        errorHandler(error);
    }
})();
