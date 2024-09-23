import { Device } from 'node-hid';
import { DeviceIdentifier } from 'uhk-common';

export function deviceVidPidInterfaceFilter(deviceIdentifier: DeviceIdentifier): (device: Device) => boolean  {
    return (device: Device): boolean => {
        return device.vendorId === deviceIdentifier.vid
            && device.productId === deviceIdentifier.pid
            && device.interface === deviceIdentifier['usb-interface'];
    };
}
