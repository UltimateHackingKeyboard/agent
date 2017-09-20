# Configuration serializer

This directory contains the configuration serializer of Agent.

The configuration of the UHK is unusually complex for a keyboard, and is composed of a number of items of different types, including keymaps, layers, macros, and the like. This is a supposed to be a short guide for the aspiring hacker. Let's get right into it!

## Setup

Given that the development dependencies are installed on your system you should be able to build the configuration serializer tester by executing `npm run build:test` in this directory, then start the test by running `node test-serializer.js`.

## Configuration representations

There are 3 different representations of the configuration, each filling a specific purpose.

The **JavaScript representation** is optimally suited to be serialized as JSON, and saved to the file system, or transmitted over the network. As a plaintext format, it's human-readable and easily editable. See [user-config.json](../../../uhk-web/src/app/services/user-config.json) for an example configuration.

The **TypeScript representation** is structurally similar to the JavaScript representation, but it features strongly typed TypeScript objects instead of typeless JavaScript objects. This representation is meant to be used by Agent. Extensive, per-property [assertion](assert.ts) takes place upon initializing the TypeScript objects to ensure the integrity of the configuration.

The **binary representation** is meant to be written to, and read from the EEPROM of the UHK. It's designed to be very compact in order to maximize the use of the 32kbyte EEPROM space.

## Configuration item types

Each configuration item belongs to a specific type. The following types are available:

**Primitive types** are integers of different sizes, and string. See [UhkBuffer](UhkBuffer.ts) which implements all the primitive types.

**Compound types** are composed of primitive types, and/or compound types. All compound types are saved into the [config-items](config-items) directory.

## Dumping serialization

The serialization of configuration items is a complicated business, and many things can go wrong. That's the exact reason why serialization can be dumped to ease debugging. All you have to do is to set `Serializable.enableDump` to `true`, and you'll see something like the following upon serialization actions:

```
KeyActions.fromJsObject: [{"keyActionType":"none"},{"keyActionType":"keystroke","scancode":110},{"keyActionType":"keystrokeModifiers","modifierMask":33},{"keyActionType":"keystrokeWithM...
    NoneAction.fromJsObject: {"keyActionType":"none"} => <NoneAction>
    KeystrokeAction.fromJsObject: {"keyActionType":"keystroke","scancode":110} => <KeystrokeAction scancode="110">
    KeystrokeModifiersAction.fromJsObject: {"keyActionType":"keystrokeModifiers","modifierMask":33} => <KeystrokeModifiersAction modifierMask="33">
    KeystrokeWithModifiersAction.fromJsObject: {"keyActionType":"keystrokeWithModifiers","scancode":120,"modifierMask":16} => <KeystrokeWithModifiersAction scancode="120" modifierMask="16">
    SwitchLayerAction.fromJsObject: {"keyActionType":"switchLayer","layer":"fn","toggle":false} => <SwitchLayerAction layer="1" toggle="false">
    DualRoleKeystrokeAction.fromJsObject: {"keyActionType":"dualRoleKeystroke","scancode":111,"longPressAction":"mod"} => <DualRoleKeystrokeAction scancode="111" longPressAction="8">
    MouseAction.fromJsObject: {"keyActionType":"mouse","mouseAction":"scrollDown"} => <MouseAction mouseAction="8">
    PlayMacroAction.fromJsObject: {"keyActionType":"playMacro","macroId":0} => <PlayMacroAction macroId="0">
    SwitchKeymapAction.fromJsObject: {"keyActionType":"switchKeymap","keymapId":1} => <SwitchKeymapAction keymapId="1">
KeyActions.toBinary: <KeyActions length="9"> => ['u8(9)]
    NoneAction.toBinary: <NoneAction> => ['u8(0)]
    KeystrokeAction.toBinary: <KeystrokeAction scancode="110"> => ['u8(1), u8(110)]
    KeystrokeModifiersAction.toBinary: <KeystrokeModifiersAction modifierMask="33"> => ['u8(2), u8(33)]
    KeystrokeWithModifiersAction.toBinary: <KeystrokeWithModifiersAction scancode="120" modifierMask="16"> => ['u8(3), u8(120), u8(16)]
    SwitchLayerAction.toBinary: <SwitchLayerAction layer="1" toggle="false"> => ['u8(5), u8(1)]
    DualRoleKeystrokeAction.toBinary: <DualRoleKeystrokeAction scancode="111" longPressAction="8"> => ['u8(4), u8(111), u8(8)]
    MouseAction.toBinary: <MouseAction mouseAction="8"> => ['u8(7), u8(8)]
    PlayMacroAction.toBinary: <PlayMacroAction macroId="0"> => ['u8(8), u8(0)]
    SwitchKeymapAction.toBinary: <SwitchKeymapAction keymapId="1"> => ['u8(6), u8(1)]
KeyActions.fromBinary: [u8(9)]
    NoneAction.fromBinary: [u8(0)] => <NoneAction>
    KeystrokeAction.fromBinary: [u8(1), u8(110)] => <KeystrokeAction scancode="110">
    KeystrokeModifiersAction.fromBinary: [u8(2), u8(33)] => <KeystrokeModifiersAction modifierMask="33">
    KeystrokeWithModifiersAction.fromBinary: [u8(3), u8(120), u8(16)] => <KeystrokeWithModifiersAction scancode="120" modifierMask="16">
    SwitchLayerAction.fromBinary: [u8(5), u8(1)] => <SwitchLayerAction layer="1" toggle="false">
    DualRoleKeystrokeAction.fromBinary: [u8(4), u8(111), u8(8)] => <DualRoleKeystrokeAction scancode="111" longPressAction="8">
    MouseAction.fromBinary: [u8(7), u8(8)] => <MouseAction mouseAction="8">
    PlayMacroAction.fromBinary: [u8(8), u8(0)] => <PlayMacroAction macroId="0">
    SwitchKeymapAction.fromBinary: [u8(6), u8(1)] => <SwitchKeymapAction keymapId="1">
KeyActions.toJsObject: <KeyActions length="9">
    NoneAction.toJsObject: <NoneAction> => {"keyActionType":"none"}
    KeystrokeAction.toJsObject: <KeystrokeAction scancode="110"> => {"keyActionType":"keystroke","scancode":110}
    KeystrokeModifiersAction.toJsObject: <KeystrokeModifiersAction modifierMask="33"> => {"keyActionType":"keystrokeModifiers","modifierMask":33}
    KeystrokeWithModifiersAction.toJsObject: <KeystrokeWithModifiersAction scancode="120" modifierMask="16"> => {"keyActionType":"keystrokeWithModifiers","scancode":120,"modifierMask":16}
    SwitchLayerAction.toJsObject: <SwitchLayerAction layer="1" toggle="false"> => {"keyActionType":"switchLayer","layer":"fn","toggle":false}
    DualRoleKeystrokeAction.toJsObject: <DualRoleKeystrokeAction scancode="111" longPressAction="8"> => {"keyActionType":"dualRoleKeystroke","scancode":111,"longPressAction":"mod"}
    MouseAction.toJsObject: <MouseAction mouseAction="8"> => {"keyActionType":"mouse","mouseAction":"scrollDown"}
    PlayMacroAction.toJsObject: <PlayMacroAction macroId="0"> => {"keyActionType":"playMacro","macroId":0}
    SwitchKeymapAction.toJsObject: <SwitchKeymapAction keymapId="1"> => {"keyActionType":"switchKeymap","keymapId":1}
```

## Testing the serializer

[test-serializer.ts](test-serializer.ts) is designed to test the serializer by taking [user-config.json](../../../uhk-web/src/app/services/user-config.json), and transforming it to TypeScript representation, then to binary representation, then finally back to JavaScript representation. This should exercise every major code path.

If the testing is successful the following should be displayed:

```
JSON configurations are identical.
Binary configurations are identical.
```
