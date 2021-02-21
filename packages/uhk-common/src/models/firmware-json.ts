export interface FirmwareJsonDevice {
    deviceId: number;
    name: string;
    source: string;
}

export interface FirmwareJsonModule {
    moduleId: number;
    name: string;
    source: string;
}

export interface FirmwareJson {
    path: string;
    firmwareVersion: string;
    deviceProtocolVersion: string;
    moduleProtocolVersion: string;
    userConfigVersion: string;
    hardwareConfigVersion: string;
    devices: Array<FirmwareJsonDevice>;
    modules: Array<FirmwareJsonModule>;
}
