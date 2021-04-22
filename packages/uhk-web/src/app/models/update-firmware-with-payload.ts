import { UploadFileData } from 'uhk-common';

export interface UpdateFirmwareWithPayload {
    uploadFileData: UploadFileData;
    forceUpgrade: boolean;
}
