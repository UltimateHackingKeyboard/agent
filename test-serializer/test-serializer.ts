import { UserConfiguration } from '../shared/src/config-serializer/config-items/UserConfiguration';
import { UhkBuffer } from '../shared/src/config-serializer/UhkBuffer';

let assert = require('assert');
let fs = require('fs');

let userConfig = JSON.parse(fs.readFileSync('../shared/src/config-serializer/user-config.json'));

let config1Js = userConfig;
let config1Ts: UserConfiguration = new UserConfiguration().fromJsonObject(config1Js);
let config1Buffer = new UhkBuffer();
config1Ts.toBinary(config1Buffer);
let config1BufferContent = config1Buffer.getBufferContent();
fs.writeFileSync('user-config.bin', config1BufferContent);

config1Buffer.offset = 0;
console.log();
let config2Ts = new UserConfiguration().fromBinary(config1Buffer);
console.log('\n');
let config2Js = config2Ts.toJsonObject();
let config2Buffer = new UhkBuffer();
config2Ts.toBinary(config2Buffer);
fs.writeFileSync('user-config-serialized.json', JSON.stringify(config2Js, undefined, 4));
let config2BufferContent = config1Buffer.getBufferContent();
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
