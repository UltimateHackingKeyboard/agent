import { VersionInformation } from './version-information';
import { UploadFileData } from './upload-file-data';

export interface UpdateFirmwareData {
    forceUpgrade: boolean;
    versionInformation: VersionInformation;
    uploadFile?: UploadFileData;
}
