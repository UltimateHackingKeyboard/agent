import { VersionInformation } from './version-information.js';
import { UploadFileData } from './upload-file-data.js';

export interface UpdateFirmwareData {
    forceUpgrade: boolean;
    versionInformation: VersionInformation;
    uploadFile?: UploadFileData;
    userConfig: string;
}
