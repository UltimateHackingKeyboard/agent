#!/usr/bin/env node

var fs = require('fs');
var BufferWriter = require('./BufferWriter');

var buffer = new Buffer(1000);
buffer.fill(0);
var writer = BufferWriter(buffer);

var uhkConfig = JSON.parse(fs.readFileSync('uhk-config.json'));
var keyActions = uhkConfig.keymaps[0].modules[0].layers[0].keyActions;

writer.uint8(0x66);
writer.uint16(0x1122);
writer.string("Hi there!");
writer.uint8(0x66);
fs.writeFileSync('uhk-config.bin', buffer);
