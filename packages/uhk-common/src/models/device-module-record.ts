export interface DeviceModule {
    builtFirmwareChecksum: string;
}

export interface DeviceModuleRecord extends Record<number, DeviceModule>{
}
