import { VersionInformation } from './version-information';

export interface UpdateFirmwareData {
    versionInformation: VersionInformation;
    firmware?: Array<number>;
}
