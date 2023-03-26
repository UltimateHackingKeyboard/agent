#!/usr/bin/env -S node --loader ts-node/esm --no-warnings=ExperimentalWarning

import { UhkBuffer, UserConfiguration } from 'uhk-common';
import * as fs from 'fs';
import { join } from 'desm';

const outputFile = process.argv[2];
const inputFile = join(import.meta.url, '../uhk-web/src/app/services/user-config.json');
const config1Js = JSON.parse(fs.readFileSync(inputFile).toString());
const config1Ts: UserConfiguration = new UserConfiguration().fromJsonObject(config1Js);
const config1Buffer = new UhkBuffer();
config1Ts.toBinary(config1Buffer);
const config1BufferContent = config1Buffer.getBufferContent();
fs.writeFileSync(outputFile, config1BufferContent);
