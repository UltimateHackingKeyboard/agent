#!/usr/bin/env node
let uhk = require('./uhk');
uhk.sendUsbPacket(new Buffer([uhk.usbCommands.readEeprom, 63, 0x00, 0x00]))
