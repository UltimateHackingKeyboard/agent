/// <reference path="UhkBuffer.ts" />
/// <reference path="KeystrokeAction.ts" />

let fs = require("fs");
let buffer: Buffer = new Buffer(1000);
buffer.fill(0);
let writer = new UhkBuffer(buffer);

let uhkConfig = JSON.parse(fs.readFileSync("uhk-config.json"));
let keyActions = uhkConfig.keymaps[0].layers[0].modules[0].keyActions;

let ARRAY_LAST_ELEMENT_ID = 0;

let KEY_ACTION_ID_KEYSTROKE_SCANCODE_FIRST        = 1;
let KEY_ACTION_ID_KEYSTROKE_SCANCODE_LAST         = 231;
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
let KEY_ACTION_ID_MOUSE                           = 244;
let KEY_ACTION_ID_PLAY_MACRO                      = 245;
let KEY_ACTION_ID_SWITCH_KEYMAP                   = 246;
let KEY_ACTION_ID_NONE                            = 255;

let SWITCH_LAYER_MOD    = 0;
let SWITCH_LAYER_FN     = 1;
let SWITCH_LAYER_MOUSE  = 2;
let SWITCH_LAYER_TOGGLE = 0x80;

let NONE_ACTION_PADDING = 0;

let MOUSE_ACTION_ID_LEFT_CLICK   = 0;
let MOUSE_ACTION_ID_MIDDLE_CLICK = 1;
let MOUSE_ACTION_ID_RIGHT_CLICK  = 2;
let MOUSE_ACTION_ID_MOVE_UP      = 3;
let MOUSE_ACTION_ID_MOVE_DOWN    = 4;
let MOUSE_ACTION_ID_MOVE_LEFT    = 5;
let MOUSE_ACTION_ID_MOVE_RIGHT   = 6;
let MOUSE_ACTION_ID_SCROLL_UP    = 7;
let MOUSE_ACTION_ID_SCROLL_DOWN  = 8;
let MOUSE_ACTION_ID_SCROLL_LEFT  = 9;
let MOUSE_ACTION_ID_SCROLL_RIGHT = 10;
let MOUSE_ACTION_ID_ACCELERATE   = 11;
let MOUSE_ACTION_ID_DECELERATE   = 12;

function serializeKeyActions(keyActions) {
    keyActions.forEach(function(keyAction) {
        serializeKeyAction(keyAction);
    });
    writer.writeUInt8(ARRAY_LAST_ELEMENT_ID);
}

function serializeKeyAction(keyAction) {
    switch (keyAction.actionType) {
        case "none":
            serializeNoneAction();
            break;
        case "keystroke":
            serializeKeystrokeAction(keyAction);
            break;
        case "dualRoleKeystroke":
            serializeDualRoleKeyAction(keyAction);
            break;
        case "mouse":
            serializeMouseAction(keyAction);
            break;
        case "playMacro":
            serializeMacroAction(keyAction);
            break;
        case "switchKeymap":
            serializeSwitchKeymapAction(keyAction);
            break;
        case "switchLayer":
            serializeSwitchLayerAction(keyAction);
            break;
        default:
            throw "KeyAction doesn't have a valid actionType property: " + keyAction.actionType;
    }
}

function serializeNoneAction() {
    writer.writeUInt8(KEY_ACTION_ID_NONE);
    writer.writeUInt8(NONE_ACTION_PADDING);
}

function serializeKeystrokeAction(keystrokeAction) {
    writer.writeUInt8(keystrokeAction.scancode);
    writer.writeUInt8(keystrokeAction.modifiers);
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

function serializeMouseAction(mouseAction) {
    writer.writeUInt8(KEY_ACTION_ID_MOUSE);
    writer.writeUInt8({
        leftClick  : MOUSE_ACTION_ID_LEFT_CLICK,
        middleClick: MOUSE_ACTION_ID_MIDDLE_CLICK,
        rightClick : MOUSE_ACTION_ID_RIGHT_CLICK,
        moveUp     : MOUSE_ACTION_ID_MOVE_UP,
        moveDown   : MOUSE_ACTION_ID_MOVE_DOWN,
        moveLeft   : MOUSE_ACTION_ID_MOVE_LEFT,
        moveRight  : MOUSE_ACTION_ID_MOVE_RIGHT,
        scrollUp   : MOUSE_ACTION_ID_SCROLL_UP,
        scrollDown : MOUSE_ACTION_ID_SCROLL_DOWN,
        scrollLeft : MOUSE_ACTION_ID_SCROLL_LEFT,
        scrollRight: MOUSE_ACTION_ID_SCROLL_RIGHT,
        accelerate : MOUSE_ACTION_ID_ACCELERATE,
        decelerate : MOUSE_ACTION_ID_DECELERATE
    }[mouseAction.mouseAction]);
}

function serializeMacroAction(macroAction) {
    writer.writeUInt8(KEY_ACTION_ID_PLAY_MACRO);
    writer.writeUInt8(macroAction.macroId);
}

function serializeSwitchKeymapAction(switchKeymapAction) {
    writer.writeUInt8(KEY_ACTION_ID_SWITCH_KEYMAP);
    writer.writeUInt8(switchKeymapAction.keymapId);
}

function serializeSwitchLayerAction(switchLayerAction) {
    writer.writeUInt8(KEY_ACTION_ID_SWITCH_LAYER);
    writer.writeUInt8({
        mod  : SWITCH_LAYER_MOD,
        fn   : SWITCH_LAYER_FN,
        mouse: SWITCH_LAYER_MOD
    }[switchLayerAction] | switchLayerAction.toggle ? SWITCH_LAYER_TOGGLE : 0);
}

new KeystrokeAction();
serializeKeyActions(keyActions);
fs.writeFileSync("uhk-config.bin", buffer);
