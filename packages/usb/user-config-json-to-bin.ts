#!/usr/bin/env ts-node
import { UhkBuffer, UserConfiguration } from 'uhk-common';
import * as fs from 'fs';

const outputFile = process.argv[2];
const inputFile = `${__dirname}/../uhk-web/src/app/services/user-config.json`;
const config1Js = JSON.parse(fs.readFileSync(inputFile).toString());
const config1Ts: UserConfiguration = new UserConfiguration().fromJsonObject(config1Js);
const config1Buffer = new UhkBuffer();
config1Ts.toBinary(config1Buffer);
const config1BufferContent = config1Buffer.getBufferContent();
fs.writeFileSync(outputFile, config1BufferContent);
