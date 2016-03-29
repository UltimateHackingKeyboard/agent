/// <reference path="Serializable.ts" />
/// <reference path="UhkBuffer.ts" />
/// <reference path="config-items/config-items.ts" />

let fs = require('fs');
let writer = new UhkBuffer();

let uhkConfig = JSON.parse(fs.readFileSync('uhk-config.json'));
let keyActions = uhkConfig.keymaps[0].layers[0].modules[0].keyActions;

let ARRAY_LAST_ELEMENT_ID = 0;

let KEY_ACTION_ID_SWITCH_LAYER                    = 232;
let KEY_ACTION_ID_DUAL_ROLE_KEYSTROKE_MOD         = 233;
let KEY_ACTION_ID_DUAL_ROLE_KEYSTROKE_FN          = 234;
let KEY_ACTION_ID_DUAL_ROLE_KEYSTROKE_MOUSE       = 235;
let KEY_ACTION_ID_DUAL_ROLE_KEYSTROKE_LEFT_CTRL   = 236;
let KEY_ACTION_ID_DUAL_ROLE_KEYSTROKE_LEFT_SHIFT  = 237;
let KEY_ACTION_ID_DUAL_ROLE_KEYSTROKE_LEFT_ALT    = 238;
let KEY_ACTION_ID_DUAL_ROLE_KEYSTROKE_LEFT_SUPER  = 239;
let KEY_ACTION_ID_DUAL_ROLE_KEYSTROKE_RIGHT_CTRL  = 240;
let KEY_ACTION_ID_DUAL_ROLE_KEYSTROKE_RIGHT_SHIFT = 241;
let KEY_ACTION_ID_DUAL_ROLE_KEYSTROKE_RIGHT_ALT   = 242;
let KEY_ACTION_ID_DUAL_ROLE_KEYSTROKE_RIGHT_SUPER = 243;
let KEY_ACTION_ID_NONE                            = 255;

let SWITCH_LAYER_MOD    = 0;
let SWITCH_LAYER_FN     = 1;
let SWITCH_LAYER_MOUSE  = 2;
let SWITCH_LAYER_TOGGLE = 0x80;

let NONE_ACTION_PADDING = 0;


function serializeKeyActions(keyActionsParam) {
    keyActionsParam.forEach(function(keyAction) {
        serializeKeyAction(keyAction);
    });
    writer.writeUInt8(ARRAY_LAST_ELEMENT_ID);
}

function serializeKeyAction(keyAction) {
    switch (keyAction.actionType) {
        case 'dualRoleKeystroke':
            serializeDualRoleKeyAction(keyAction);
            break;
        case 'switchLayer':
            serializeSwitchLayerAction(keyAction);
            break;
        default:
            throw 'KeyAction doesn\'t have a valid actionType property: ' + keyAction.actionType;
    }
}

function serializeDualRoleKeyAction(dualRoleKeyAction) {
    writer.writeUInt8({
        mod         : KEY_ACTION_ID_DUAL_ROLE_KEYSTROKE_MOD,
        fn          : KEY_ACTION_ID_DUAL_ROLE_KEYSTROKE_FN,
        mouse       : KEY_ACTION_ID_DUAL_ROLE_KEYSTROKE_MOUSE,
        leftControl : KEY_ACTION_ID_DUAL_ROLE_KEYSTROKE_LEFT_CTRL,
        leftShift   : KEY_ACTION_ID_DUAL_ROLE_KEYSTROKE_LEFT_SHIFT,
        leftAlt     : KEY_ACTION_ID_DUAL_ROLE_KEYSTROKE_LEFT_ALT,
        leftSuper   : KEY_ACTION_ID_DUAL_ROLE_KEYSTROKE_LEFT_SUPER,
        rightControl: KEY_ACTION_ID_DUAL_ROLE_KEYSTROKE_RIGHT_CTRL,
        rightShift  : KEY_ACTION_ID_DUAL_ROLE_KEYSTROKE_RIGHT_SHIFT,
        rightAlt    : KEY_ACTION_ID_DUAL_ROLE_KEYSTROKE_RIGHT_ALT,
        rightSuper  : KEY_ACTION_ID_DUAL_ROLE_KEYSTROKE_RIGHT_SUPER
    }[dualRoleKeyAction.longPressAction]);
    writer.writeUInt8(dualRoleKeyAction.scancode);
}

function serializeSwitchLayerAction(switchLayerAction) {
    writer.writeUInt8(KEY_ACTION_ID_SWITCH_LAYER);
    writer.writeUInt8({
        mod  : SWITCH_LAYER_MOD,
        fn   : SWITCH_LAYER_FN,
        mouse: SWITCH_LAYER_MOD
    }[switchLayerAction] | switchLayerAction.toggle ? SWITCH_LAYER_TOGGLE : 0);
}

//serializeKeyActions(keyActions);
fs.writeFileSync('uhk-config.bin', writer.buffer);
