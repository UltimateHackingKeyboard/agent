# Configuration serializer

This directory contains the configuration serializer of Agent. 

The configuration of the UHK is unusually complex for a keyboard, composed of a number of items of different types, including keymaps, layers, macros, and the like. This is a supposed to be a short guide for the aspiring hacker. Let's get right into it!

## The 3 representations of the configuration

There are 3 different representations of the configuration, each filling a specific purpose.

The **JavaScript representation** is optimally suited to be serialized as JSON on a hard drive, or transmitted over the network. As a plaintext format, it's also human-readable and easily editable. 

The **TypeScript representation** is structurally similar to the JavaScript representation, but it features strongly typed TypeScript objects instead of typeless JavaScript objects. It's meant to be used within Agent. Extensive validation is taking place when constructing the TypeScript objects, ensuring the integrity of the configuration.

The **binary representation** is meant to be written to, and read from the EEPROM of the UHK. It's supposed to be very compact in order to maximize the use of the 32kbyte EEPROM space.
