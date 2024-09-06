import { UHK_DEVICE_IDS_TYPE } from 'uhk-common';

export default function calculateBcdDevice(deviceId: UHK_DEVICE_IDS_TYPE, bootloader: boolean): number {
    if (bootloader) {
        return deviceId + 256;
    }

    return deviceId;
}
