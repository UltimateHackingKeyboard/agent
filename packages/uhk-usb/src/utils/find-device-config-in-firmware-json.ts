import { FirmwareJson, FirmwareJsonDevice, UhkDeviceProduct} from 'uhk-common';

export function findDeviceConfigInFirmwareJson(device: UhkDeviceProduct, firmwareJson: FirmwareJson): FirmwareJsonDevice {
    const deviceConfig = firmwareJson.devices.find(firmwareDevice => firmwareDevice.deviceId === device.id);

    if (!deviceConfig) {
        throw new Error(`The user config does not support: ${device.name}`);
    }

    return deviceConfig;
}
