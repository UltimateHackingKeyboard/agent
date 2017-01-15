#!/usr/bin/env node
let uhk = require('./uhk');
uhk.sendUsbPacket(new Buffer([uhk.usbCommands.jumpToBootloader]));
