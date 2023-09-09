export interface DeviceModule {
    md5: string;
}

export interface DeviceModuleRecord extends Record<number, DeviceModule>{
}
