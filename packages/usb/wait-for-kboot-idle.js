#!/usr/bin/env node
const uhk = require('./uhk');

let intervalMs = 100;
let pingMessageInterval = 500;

async function waitForKbootIdle(device) {
    let timeoutMs = 10000;
    return new Promise((resolve, reject) => {
        const intervalId = setInterval(async function() {
            const response = await uhk.writeDevice(device, [uhk.usbCommands.getDeviceProperty, uhk.devicePropertyIds.currentKbootCommand]);
            const currentKbootCommand = response[1];
            if (currentKbootCommand == 0) {
                console.log('Bootloader pinged.');
                resolve();
                clearInterval(intervalId);
                return;
            } else if (timeoutMs % pingMessageInterval === 0) {
                console.log("Cannot ping the bootloader. Please reconnect the left keyboard half. It probably needs several tries, so keep reconnecting until you see this message.");
            };

            timeoutMs -= intervalMs;

            if (timeoutMs < 0) {
                reject();
                clearInterval(intervalId);
                return;
            }
        }, intervalMs);
    });
}

const device = uhk.getUhkDevice();

(async function() {
    await waitForKbootIdle(device);
})();
