/// <reference path="assert.ts" />
/// <reference path="TypeChecker.ts" />
/// <reference path="Serializable.ts" />
/// <reference path="UhkBuffer.ts" />
/// <reference path="config-items/config-items.ts" />

let assert = require('assert');
let fs = require('fs');

let buffer = new UhkBuffer();
let uhkConfig = JSON.parse(fs.readFileSync('uhk-config.json'));
let keyActions = uhkConfig.keymaps[0].layers[0].modules[0].keyActions;
let keyActionObjects: KeyActions = new KeyActions().fromJsObject(keyActions);

keyActionObjects.toBinary(buffer);
fs.writeFileSync('uhk-config.bin', buffer.getBufferContent());

buffer.offset = 0;
let serializedKeyActions = new KeyActions().fromBinary(buffer).toJsObject();
fs.writeFileSync('uhk-config-serialized.json', JSON.stringify(serializedKeyActions, undefined, 4));

assert.deepEqual(keyActions, serializedKeyActions);
console.log('JSON configurations are identical.');
