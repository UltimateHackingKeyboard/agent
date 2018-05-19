#!/usr/bin/env node
const uhk = require('./uhk');

const device = uhk.getUhkDevice();
uhk.eraseHca(device)
    .catch((err)=>{
        console.error(err);
    });
