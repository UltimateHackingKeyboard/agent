#!/usr/bin/env node
const uhk = require('./uhk');

if (process.argv.length < 2) {
    console.log(`use: write-hardware-config {iso|ansi}`);
    process.exit(1);
}

const layout = process.argv[2];
if (layout !== 'iso' && layout !== 'ansi') {
    console.log('Invalid layout. Layout should be either iso or ansi');
    process.exit(1);
}

const device = uhk.getUhkDevice();
uhk.writeHca(device, layout === 'iso')
    .catch((err)=>{
        console.error(err);
    });
