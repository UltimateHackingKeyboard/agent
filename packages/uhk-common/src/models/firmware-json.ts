export interface FirmwareJsonDevice {
    deviceId: number;
    name: string;
    source: string;
    md5: string;
}

export interface FirmwareJsonModule {
    moduleId: number;
    name: string;
    source: string;
    md5: string;
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
    gitInfo?: {
        repo: string;
        tag: string;
    }
}

export function defaultFirmwareJson(): FirmwareJson {
    return {
        deviceProtocolVersion: '',
        devices: [],
        firmwareVersion: '',
        gitInfo: {
            repo: '',
            tag: ''
        },
        hardwareConfigVersion: '',
        moduleProtocolVersion: '',
        modules: [],
        path: '',
        userConfigVersion: '',
    };
}
