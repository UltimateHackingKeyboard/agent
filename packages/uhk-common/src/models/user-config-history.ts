import { UhkDeviceProduct } from './uhk-products';

export interface HistoryFileInfo {
    filePath: string;
    md5Hash: string;
    timestamp: string;
}

export interface DeviceUserConfigHistory {
    uniqueId: number;
    device: UhkDeviceProduct;
    /**
     * Device name from the latest user configuration.
     */
    deviceName: string;
    files: HistoryFileInfo[];
}

export interface UserConfigHistory {
    /**
     * Files in the root of the history directory.
     * These files are common for all devices, because we introduced the device specific history directories later.
     * We show the common files in the UI for every device.
     */
    commonFiles: HistoryFileInfo[];
    devices: DeviceUserConfigHistory[];
}
