/// <reference path="TypeChecker.ts" />
/// <reference path="Serializable.ts" />
/// <reference path="UhkBuffer.ts" />
/// <reference path="config-items/config-items.ts" />

let fs = require('fs');
let writer = new UhkBuffer();

let uhkConfig = JSON.parse(fs.readFileSync('uhk-config.json'));
let keyActions = uhkConfig.keymaps[0].layers[0].modules[0].keyActions;

fs.writeFileSync('uhk-config.bin', writer.buffer);
