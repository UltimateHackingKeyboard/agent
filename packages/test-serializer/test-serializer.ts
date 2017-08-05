import { UserConfiguration } from '../shared/src/config-serializer/config-items/user-configuration';
import { UhkBuffer } from '../shared/src/config-serializer/uhk-buffer';

const assert = require('assert');
const fs = require('fs');

const userConfig = JSON.parse(fs.readFileSync('../shared/src/config-serializer/user-config.json'));

const config1Js = userConfig;
const config1Ts: UserConfiguration = new UserConfiguration().fromJsonObject(config1Js);
const config1Buffer = new UhkBuffer();
config1Ts.toBinary(config1Buffer);
const config1BufferContent = config1Buffer.getBufferContent();
fs.writeFileSync('user-config.bin', config1BufferContent);

config1Buffer.offset = 0;
console.log();
const config2Ts = new UserConfiguration().fromBinary(config1Buffer);
console.log('\n');
const config2Js = config2Ts.toJsonObject();
const config2Buffer = new UhkBuffer();
config2Ts.toBinary(config2Buffer);
fs.writeFileSync('user-config-serialized.json', JSON.stringify(config2Js, undefined, 4));
const config2BufferContent = config1Buffer.getBufferContent();
fs.writeFileSync('user-config-serialized.bin', config2BufferContent);

console.log('\n');
let returnValue = 0;
try {
    assert.deepEqual(config1Js, config2Js);
    console.log('JSON configurations are identical.');
} catch (error) {
    console.log('JSON configurations differ.');
    returnValue = 1;
}

const buffersContentsAreEqual: boolean = Buffer.compare(config1BufferContent, config2BufferContent) === 0;
if (buffersContentsAreEqual) {
    console.log('Binary configurations are identical.');
} else {
    console.log('Binary configurations differ.');
    returnValue += 2;
}

process.exit(returnValue);
