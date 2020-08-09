import { UploadFileData } from 'uhk-common';

export interface LoadUserConfigurationFromFilePayload {
    uploadFileData: UploadFileData;
    /**
     * Automatically save the imported configuration to the keyboar or not
     */
    autoSave: boolean;
}
