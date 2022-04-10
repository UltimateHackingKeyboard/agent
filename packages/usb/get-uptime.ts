#!/usr/bin/env ../../node_modules/.bin/ts-node-esm

import Uhk, { errorHandler, yargs } from './src/index.js';

(async function () {
    try {
        const argv = yargs
            .usage('Get uptime')
            .argv;

        const { operations } = Uhk(argv);

        const uptime = await operations.getUptime();
        // tslint:disable-next-line:max-line-length
        console.log(`uptime: ${uptime.days}d ${uptime.hours.toString(10).padStart(2, '')}:${uptime.minutes.toString(10).padStart(2, '')}:${uptime.seconds.toString(10).padStart(2, '')}`);
    } catch (error) {
        errorHandler(error);
    }
})();
