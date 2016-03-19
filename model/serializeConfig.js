#!/usr/bin/env node

var fs = require('fs');
var BufferWriter = require('./BufferWriter');

var buffer = new Buffer(1000);
buffer.fill(0);
var writer = BufferWriter(buffer);

var uhkConfig = JSON.parse(fs.readFileSync('uhk-config.json'));
var keyActions = uhkConfig.keymaps[0].modules[0].layers[0].keyActions;

var KEY_ACTION_ID_NONE                            = 0;
var KEY_ACTION_ID_KEYSTROKE_SCANCODE_FIRST        = 1;
var KEY_ACTION_ID_KEYSTROKE_SCANCODE_LAST         = 231;
var KEY_ACTION_ID_DUAL_ROLE_KEYSTROKE_MOD         = 232;
var KEY_ACTION_ID_DUAL_ROLE_KEYSTROKE_FN          = 233;
var KEY_ACTION_ID_DUAL_ROLE_KEYSTROKE_MOUSE       = 234;
var KEY_ACTION_ID_DUAL_ROLE_KEYSTROKE_LEFT_CTRL   = 235;
var KEY_ACTION_ID_DUAL_ROLE_KEYSTROKE_LEFT_SHIFT  = 236;
var KEY_ACTION_ID_DUAL_ROLE_KEYSTROKE_LEFT_ALT    = 237;
var KEY_ACTION_ID_DUAL_ROLE_KEYSTROKE_LEFT_SUPER  = 238;
var KEY_ACTION_ID_DUAL_ROLE_KEYSTROKE_RIGHT_CTRL  = 239;
var KEY_ACTION_ID_DUAL_ROLE_KEYSTROKE_RIGHT_SHIFT = 240;
var KEY_ACTION_ID_DUAL_ROLE_KEYSTROKE_RIGHT_ALT   = 241;
var KEY_ACTION_ID_DUAL_ROLE_KEYSTROKE_RIGHT_SUPER = 242;
var KEY_ACTION_ID_MOUSE                           = 243;
var KEY_ACTION_ID_PLAY_MACRO                      = 244;
var KEY_ACTION_ID_SWITCH_KEYMAP                   = 245;

var NONE_ACTION_PADDING = 0;

var MOUSE_ACTION_ID_LEFT_CLICK   = 0;
var MOUSE_ACTION_ID_MIDDLE_CLICK = 1;
var MOUSE_ACTION_ID_RIGHT_CLICK  = 2;
var MOUSE_ACTION_ID_MOVE_UP      = 3;
var MOUSE_ACTION_ID_MOVE_DOWN    = 4;
var MOUSE_ACTION_ID_MOVE_LEFT    = 5;
var MOUSE_ACTION_ID_MOVE_RIGHT   = 6;
var MOUSE_ACTION_ID_SCROLL_UP    = 7;
var MOUSE_ACTION_ID_SCROLL_DOWN  = 8;
var MOUSE_ACTION_ID_SCROLL_LEFT  = 9;
var MOUSE_ACTION_ID_SCROLL_RIGHT = 10;
var MOUSE_ACTION_ID_ACCELERATE   = 11;
var MOUSE_ACTION_ID_DEELERATE    = 12;

function serializeKeyActions(keyActions) {
    keyActions.forEach(function(keyAction) {
        serializeKeyAction(keyAction);
    });
}

function serializeKeyAction(keyAction) {
    console.log(keyAction);
    switch (keyAction.actionType) {
        case 'none':
            serializeNoneAction();
            break;
        case 'key':
            serializeKeystrokeAction(keyAction);
            break;
        case 'dualRoleKey':
            serializeDualRoleKeyAction(keyAction);
            break;
        case 'mouse':
            serializeMouseAction(keyAction);
            break;
        case 'playMacro':
            serializeMacroAction(keyAction);
            break;
        case 'switchKeymap':
            serializeSwitchKeymapAction(keyAction);
            break;
        default:
            throw "KeyAction doesn't have a valid actionType property!";
    }
}

function serializeNoneAction(keystrokeAction) {
    writer.uint8(KEY_ACTION_ID_NONE);
    writer.uint8(NONE_ACTION_PADDING);
}

function serializeKeystrokeAction(keystrokeAction) {
    writer.uint8(keystrokeAction.scancode);
    writer.uint8(keystrokeAction.modifiers);
}

function serializeDualRoleKeyAction(dualRoleKeyAction) {
    writer.uint8({
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
    writer.uint8(dualRoleKeyAction.scancode);
}

function serializeMouseAction(mouseAction) {
    writer.uint8(KEY_ACTION_ID_MOUSE);
    writer.uint8({
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
        decelerate : MOUSE_ACTION_ID_DEELERATE
    }[mouseAction.mouseAction]);
}

function serializeMacroAction(macroAction) {
    writer.uint8(KEY_ACTION_ID_PLAY_MACRO);
    writer.uint8(macroAction.macroId);
}

function serializeSwitchKeymapAction(switchKeymapAction) {
    writer.uint8(KEY_ACTION_ID_SWITCH_KEYMAP);
    writer.uint8(switchKeymapAction.keymapId);
}

writer.uint8(0x66);
writer.uint16(0x1122);
writer.string("Hi there!");
writer.uint8(0x66);
serializeKeyActions(keyActions);
fs.writeFileSync('uhk-config.bin', buffer);
