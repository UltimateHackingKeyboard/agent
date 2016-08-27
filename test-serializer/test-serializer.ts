import {Serializable} from '../src/config-serializer/Serializable';
import {UhkBuffer} from '../src/config-serializer/UhkBuffer';
import {UhkConfiguration} from '../src/config-serializer/config-items/UhkConfiguration';

let assert = require('assert');
let fs = require('fs');

let uhkConfig = JSON.parse(fs.readFileSync('uhk-config.json'));

let config1Js = uhkConfig;
let config1Ts: Serializable<UhkConfiguration> = new UhkConfiguration().fromJsObject(config1Js);
let config1Buffer = new UhkBuffer();
config1Ts.toBinary(config1Buffer);
let config1BufferContent = config1Buffer.getBufferContent();
fs.writeFileSync('uhk-config.bin', config1BufferContent);

config1Buffer.offset = 0;
console.log();
let config2Ts = new UhkConfiguration().fromBinary(config1Buffer);
console.log('\n');
let config2Js = config2Ts.toJsObject();
let config2Buffer = new UhkBuffer();
config2Ts.toBinary(config2Buffer);
fs.writeFileSync('uhk-config-serialized.json', JSON.stringify(config2Js, undefined, 4));
let config2BufferContent = config1Buffer.getBufferContent();
fs.writeFileSync('uhk-config-serialized.bin', config2BufferContent);

console.log('\n');
let error: boolean;
try {
    assert.deepEqual(config1Js, config2Js);
    console.log('JSON configurations are identical.');
} catch (error) {
    console.log('JSON configurations differ.');
    error = true;
}

const buffersContentsAreEqual: boolean = Buffer.compare(config1BufferContent, config2BufferContent) === 0;
if (buffersContentsAreEqual) {
    console.log('Binary configurations are identical.');
} else {
    console.log('Binary configurations differ.');
    error = true;
}

process.exit(error ? 1 : 0);
