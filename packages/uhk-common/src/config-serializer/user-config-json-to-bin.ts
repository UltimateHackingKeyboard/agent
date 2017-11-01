import { UhkBuffer, UserConfiguration } from './index';

const fs = require('fs');

const inputFile = process.argv[2];
console.log(inputFile);
const outputFile = process.argv[3];

const config1Js = JSON.parse(fs.readFileSync(inputFile));
const config1Ts: UserConfiguration = new UserConfiguration().fromJsonObject(config1Js);
const config1Buffer = new UhkBuffer();
config1Ts.toBinary(config1Buffer);
const config1BufferContent = config1Buffer.getBufferContent();
fs.writeFileSync('user-config.bin', config1BufferContent);
