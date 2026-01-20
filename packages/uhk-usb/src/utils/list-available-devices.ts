import { Device } from 'node-hid';
import { PortInfo } from '@serialport/bindings-interface';
import { SerialPort } from 'serialport';
import { LogService } from 'uhk-common';

import { getUhkHidDevices } from './get-uhk-hid-devices.js';
import { usbDeviceJsonFormatter } from './usb-device-json-formatter.js';

enum UsbDeviceConnectionStates {
    Unknown,
    Added,
    Removed,
    AlreadyExisted
}

interface UsvDeviceConnectionState {
    id: string;
    device: Device | PortInfo;
    state: UsbDeviceConnectionStates;
}

export interface ListAvailableDevicesOptions{
    hidDevices?: Device[];
    serialDevices?: PortInfo[];
    showUnchangedMsg?: boolean;
    logService: LogService;
}

const prevDevices = new Map<string, UsvDeviceConnectionState>

export async function listAvailableDevices(options: ListAvailableDevicesOptions): Promise<void> {
    let hasDeviceChanges = false;

    for (const prevDevice of prevDevices.values()) {
        prevDevice.state = UsbDeviceConnectionStates.Unknown;
    }

    const hidDevices = options.hidDevices ?? await getUhkHidDevices();
    for (const hidDevice of hidDevices) {
        const id = `h-${hidDevice.vendorId}-${hidDevice.productId}-${hidDevice.interface}`
        const existingPrevDevice = prevDevices.get(id);

        if (existingPrevDevice) {
            existingPrevDevice.state = UsbDeviceConnectionStates.AlreadyExisted;
        }
        else {
            prevDevices.set(id, {
                id,
                device: hidDevice,
                state: UsbDeviceConnectionStates.Added
            });
            hasDeviceChanges = true;
        }
    }

    const serialDevices = options.serialDevices ?? await SerialPort.list();
    for (const serialDevice of serialDevices) {
        const id = `s-${serialDevice.vendorId}-${serialDevice.productId}-${serialDevice.path}`
        const existingPrevDevice = prevDevices.get(id);

        if (existingPrevDevice) {
            existingPrevDevice.state = UsbDeviceConnectionStates.AlreadyExisted;
        }
        else {
            prevDevices.set(id, {
                id,
                device: serialDevice,
                state: UsbDeviceConnectionStates.Added
            });
            hasDeviceChanges = true;
        }
    }

    for (const prevDevice of prevDevices.values()) {
        if (prevDevice.state === UsbDeviceConnectionStates.Unknown) {
            prevDevice.state = UsbDeviceConnectionStates.Removed;
            hasDeviceChanges = true;
        }
    }

    const showUnchangedMsg = options.showUnchangedMsg ?? true

    if (hasDeviceChanges) {
        options.logService.misc('[UhkHidDevice] Available devices changed.');
        for (const prevDevice of prevDevices.values()) {
            if (prevDevice.state === UsbDeviceConnectionStates.Added) {
                options.logService.misc(`[UhkHidDevice] Added: ${JSON.stringify(prevDevice.device, usbDeviceJsonFormatter)}`);
            } else if (prevDevice.state === UsbDeviceConnectionStates.Removed) {
                options.logService.misc(`[UhkHidDevice] Removed: ${JSON.stringify(prevDevice.device, usbDeviceJsonFormatter)}`);
                prevDevices.delete(prevDevice.id);
            }
        }
    } else if (showUnchangedMsg) {
        options.logService.misc('[UhkHidDevice] Available devices unchanged');
    }
}
