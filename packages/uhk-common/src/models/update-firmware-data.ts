import { VersionInformation } from './version-information';
import { UploadFileData } from './upload-file-data';

export interface UpdateFirmwareData {
    versionInformation: VersionInformation;
    uploadFile?: UploadFileData;
}
