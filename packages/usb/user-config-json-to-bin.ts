#!/usr/bin/env -S node --loader ts-node/esm --no-warnings=ExperimentalWarning

import { UhkBuffer, UserConfiguration } from 'uhk-common';
import * as fs from 'fs';
import { join } from 'desm';

import { yargs } from './src/index.js';

const USER_CONFIG_TYPES = '{uhk60|uhk80}'
;
const argv = yargs
    .scriptName('./user-config-json-to-bin.ts')
    .usage(`Usage: $0 ${USER_CONFIG_TYPES} <output path>`)
    .demandCommand(2, 'User configuration type and output path are required')
    .argv as any;

const userConfigType = argv._[0];
const outputFile = argv._[1];

if (userConfigType !== 'uhk60' && userConfigType !== 'uhk80') {
    console.log(`Invalid user config type: ${userConfigType}. Available options: ${USER_CONFIG_TYPES}`);
    process.exit(1);
}

const inputFileName = userConfigType === 'uhk60' ? 'user-config.json' : 'user-config-80.json';
const inputFile = join(import.meta.url, '..', 'uhk-web', 'src', 'app', 'services', inputFileName);
const config1Js = JSON.parse(fs.readFileSync(inputFile).toString());
const config1Ts: UserConfiguration = new UserConfiguration().fromJsonObject(config1Js);
const config1Buffer = new UhkBuffer();
config1Ts.toBinary(config1Buffer);
const config1BufferContent = config1Buffer.getBufferContent();
fs.writeFileSync(outputFile, config1BufferContent);
