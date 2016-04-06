# Configuration serializer

This directory contains the configuration serializer of Agent. 

The configuration of the UHK is unusually complex for a keyboard, composed of a number of items of different types, including keymaps, layers, macros, and the like. This is a supposed to be a short guide for the aspiring hacker. Let's get right into it!

## Configuration representations

There are 3 different representations of the configuration, each filling a specific purpose.

The **JavaScript representation** is optimally suited to be serialized as JSON, and saved to the file system, or transmitted over the network. As a plaintext format, it's human-readable and easily editable. See [uhk-config.json](uhk-config.json) for an example configuration. 

The **TypeScript representation** is structurally similar to the JavaScript representation, but it features strongly typed TypeScript objects instead of typeless JavaScript objects. This representation is meant to be used by Agent. Extensive validation takes place upon constructing the TypeScript objects to ensure the integrity of the configuration.

The **binary representation** is meant to be written to, and read from the EEPROM of the UHK. It's designed to be very compact in order to maximize the use of the 32kbyte EEPROM space.

## Configuration types

Each configuration item belongs to a specific type. The following types are available:

**Primitive types** are integers of different sizes, and string. See [UhkBuffer](UhkBuffer.ts) which implements all the primitive types.

**Compound types** are composed of primitive types, and/or compound types. All compound types must descend from the [Serializable](Serializable.ts) class, and saved into the [config-items](config-items) directory.

**Array type** is a special compound type which is composed of a sequence of items of a specific type. Array items must descend from the [ClassArray](ClassArray.ts) class.
