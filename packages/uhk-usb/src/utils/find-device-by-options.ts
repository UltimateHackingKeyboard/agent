import { Device } from 'node-hid';
import { CommandLineArgs } from 'uhk-common';

export function findDeviceByOptions(options: CommandLineArgs): (device: Device) => boolean {
    return (device: Device) => {
        return device.vendorId === options.vid
            && device.productId === options.pid
            && device.interface === options['usb-interface'];
    };
}
