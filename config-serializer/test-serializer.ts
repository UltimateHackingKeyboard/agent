/// <reference path="Function.d.ts" />
/// <reference path="assert.ts" />
/// <reference path="Serializable.ts" />
/// <reference path="ClassArray.ts" />
/// <reference path="UhkBuffer.ts" />
/// <reference path="config-items/config-items.ts" />

let assert = require('assert');
let fs = require('fs');

let uhkConfig = JSON.parse(fs.readFileSync('uhk-config.json'));
/*
let keyActions1Js = uhkConfig.keymaps[0].layers[0].modules[0].keyActions;
let keyActions1Ts: Serializable<KeyActions> = new KeyActions().fromJsObject(keyActions1Js);
let keyActions1Buffer = new UhkBuffer();
keyActions1Ts.toBinary(keyActions1Buffer);
let keyActions1BufferContent = keyActions1Buffer.getBufferContent();
fs.writeFileSync('uhk-config.bin', keyActions1BufferContent);

keyActions1Buffer.offset = 0;
let keyActions2Ts = new KeyActions().fromBinary(keyActions1Buffer);
let keyActions2Js = keyActions2Ts.toJsObject();
let keyActions2Buffer = new UhkBuffer();
keyActions2Ts.toBinary(keyActions2Buffer);
fs.writeFileSync('uhk-config-serialized.json', JSON.stringify(keyActions2Js, undefined, 4));
let keyActions2BufferContent = keyActions1Buffer.getBufferContent();
fs.writeFileSync('uhk-config-serialized.bin', keyActions2BufferContent);
*/

let modulesbaseJs = uhkConfig.keymaps[0].layers[0].modules;
let modules1Ts: Serializable<Modules> = new Modules().fromJsObject(modulesbaseJs);
let modules1Js = modules1Ts.toJsObject();
let modules1Buffer = new UhkBuffer();
modules1Ts.toBinary(modules1Buffer);
let modules1BufferContent = modules1Buffer.getBufferContent();
fs.writeFileSync('uhk-config.bin', modules1BufferContent);
fs.writeFileSync('uhk-config-test.json',JSON.stringify(modules1Js,undefined,4));

modules1Buffer.offset = 0;
let modules2Ts = new Modules().fromBinary(modules1Buffer);
let modules2Js = modules2Ts.toJsObject();
let modules2Buffer = new UhkBuffer();
modules2Ts.toBinary(modules2Buffer);
fs.writeFileSync('uhk-config-serialized.json', JSON.stringify(modules2Js, undefined, 4));
let modules2BufferContent = modules1Buffer.getBufferContent();
fs.writeFileSync('uhk-config-serialized.bin', modules2BufferContent);

try {
    /* wanted to also compare class->json & class->binary->class->json with original json */
    assert.deepEqual(modulesbaseJs, modules1Js);
    assert.deepEqual(modules1Js, modules2Js);
    console.log('JSON configurations are identical.');
} catch (error) {
    console.log('JSON configurations differ.');
}

let buffersContentsAreEqual = Buffer.compare(modules1BufferContent, modules2BufferContent) === 0;
console.log('Binary configurations ' + (buffersContentsAreEqual ? 'are identical' : 'differ') + '.');
