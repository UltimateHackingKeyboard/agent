#!/usr/bin/env -S node

import HID, {HIDAsync} from 'node-hid';

const devices = HID.devices();
const device = devices.find(dev => dev.vendorId === 0x1D50 && dev.productId === 0x6125 && dev.usagePage === 65280 && dev.usage === 1);

if (!device) {
    console.error('Device not found');
    process.exit(1);
}

/****************************************************************************************
 * Method 1 - using write and async read
 * The expected behaviour is log any data or error response
****************************************************************************************/
// const hid = new HID.HID(device.path);
//
// hid.on('data', (data) => {
//     console.log('data: ', data);
// })
// hid.on('error', (error) => {
//     console.log('error: ', error);
// })
//
// console.log('write: 4 9');
// hid.write([4, 9])
// console.log('read...');

/****************************************************************************************
 * Method 2 - using write and sync read
 * The expected behaviour is log any data or thrown an error
 ****************************************************************************************/
// const hid = new HID.HID(device.path);
//
// console.log('write: 4 9');
// hid.write([4, 9])
// console.log('read...');
// const data = hid.readSync();
//
// console.log('data: ', data);

/****************************************************************************************
 * Method 3 - using write and sync read with timeout
 * The expected behaviour is log any data or thrown an error
 ****************************************************************************************/
const hid = new HID.HID(device.path);

const dataToSend = [4, 9];
console.log('write:', dataToSend);
hid.write(dataToSend)
console.log('read 5 second timeout');
const data = hid.readTimeout(5000); // 5 seconds timeout

console.log('data: ', data);


/****************************************************************************************
 * Method 4 - use feature reports
 * Totally not working
 ****************************************************************************************/
// const hid = new HID.HID(device.path);
//
// console.log('write: 4 9');
// hid.sendFeatureReport([4, 9])
// console.log('read...');
// const data = hid.getFeatureReport(4, 1);
//
// console.log('data: ', data);

/****************************************************************************************
 * Method 5 - new node-hid async API
 ****************************************************************************************/
// const hid = await HID.HIDAsync.open(device.path);
// hid.on('data', (data) => {
//     console.log('data: ', data);
// })
// hid.on('error', (error) => {
//     console.log('error: ', error);
// })
//
// console.log('write: 4 9');
// await hid.write([4, 9])
// console.log('read...');
