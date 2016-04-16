/// <reference path="Function.d.ts" />
/// <reference path="assert.ts" />
/// <reference path="Serializable.ts" />
/// <reference path="ClassArray.ts" />
/// <reference path="UhkBuffer.ts" />
/// <reference path="config-items/config-items.ts" />

let assert = require('assert');
let fs = require('fs');

let uhkConfig = JSON.parse(fs.readFileSync('uhk-config.json'));

let modules1Js = uhkConfig.keymaps[0].layers[0].modules;
let modules1Ts: Serializable<Modules> = new Modules().fromJsObject(modules1Js);
let modules1Buffer = new UhkBuffer();
modules1Ts.toBinary(modules1Buffer);
let modules1BufferContent = modules1Buffer.getBufferContent();
fs.writeFileSync('uhk-config.bin', modules1BufferContent);

modules1Buffer.offset = 0;
console.log();
let modules2Ts = new Modules().fromBinary(modules1Buffer);
console.log('\n');
let modules2Js = modules2Ts.toJsObject();
let modules2Buffer = new UhkBuffer();
modules2Ts.toBinary(modules2Buffer);
fs.writeFileSync('uhk-config-serialized.json', JSON.stringify(modules2Js, undefined, 4));
let modules2BufferContent = modules1Buffer.getBufferContent();
fs.writeFileSync('uhk-config-serialized.bin', modules2BufferContent);

console.log('\n');
try {
    assert.deepEqual(modules1Js, modules2Js);
    console.log('JSON configurations are identical.');
} catch (error) {
    console.log('JSON configurations differ.');
}

let buffersContentsAreEqual = Buffer.compare(modules1BufferContent, modules2BufferContent) === 0;
console.log('Binary configurations ' + (buffersContentsAreEqual ? 'are identical' : 'differ') + '.');
