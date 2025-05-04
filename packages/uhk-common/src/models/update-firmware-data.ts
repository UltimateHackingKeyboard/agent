import { UploadFileData } from './upload-file-data.js';

export interface UpdateFirmwareData {
    forceUpgrade: boolean;
    uploadFile?: UploadFileData;
    userConfig: string;
}
