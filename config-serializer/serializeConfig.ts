/// <reference path="Serializable.ts" />
/// <reference path="UhkBuffer.ts" />
/// <reference path="config-items/config-items.ts" />

let fs = require('fs');
let writer = new UhkBuffer();

let uhkConfig = JSON.parse(fs.readFileSync('uhk-config.json'));
let keyActions = uhkConfig.keymaps[0].layers[0].modules[0].keyActions;

let SWITCH_LAYER_MOD    = 0;
let SWITCH_LAYER_FN     = 1;
let SWITCH_LAYER_MOUSE  = 2;
let SWITCH_LAYER_TOGGLE = 0x80;

function serializeKeyAction(keyAction) {
    switch (keyAction.actionType) {
        case 'switchLayer':
            serializeSwitchLayerAction(keyAction);
            break;
        default:
            throw 'KeyAction doesn\'t have a valid actionType property: ' + keyAction.actionType;
    }
}

function serializeSwitchLayerAction(switchLayerAction) {
    writer.writeUInt8({
        mod  : SWITCH_LAYER_MOD,
        fn   : SWITCH_LAYER_FN,
        mouse: SWITCH_LAYER_MOD
    }[switchLayerAction] | switchLayerAction.toggle ? SWITCH_LAYER_TOGGLE : 0);
}

fs.writeFileSync('uhk-config.bin', writer.buffer);
