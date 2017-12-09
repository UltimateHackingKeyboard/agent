#!/usr/bin/env ts-node
///<reference path="./node_modules/@types/node/index.d.ts"/>

import { UhkBlhost, UhkHidDevice, UhkOperations } from 'uhk-usb';
import { LogService } from 'uhk-common';
import * as fs from 'fs';

if (process.argv.length < 3) {
    console.log(`use: write-userconfig <path to config file.bin>`);
    process.exit(1);
}

const fileContent = fs.readFileSync(process.argv[2]);
const json = JSON.stringify(fileContent);
const logger = new LogService();
const uhkDevice = new UhkHidDevice(logger);
const uhkBlHost = new UhkBlhost(logger, '.');
const uhkOperations = new UhkOperations(logger, uhkBlHost, uhkDevice, '.');

const init = async (): Promise<void> => {
    await uhkOperations.saveUserConfiguration(json);
};

init()
    .then(() => {
        console.log('Success');
    })
    .catch(error => {
        console.log(error);
        process.exit(-1);
    });
