export interface OpenUserConfigDialogResult {
    canceled: boolean;
    filePath?: string;
    data?: Array<number>;
}

export interface SaveUserConfigDialogData {
    fileName: string;
    /**
     * Base64 encoded file content.
     */
    content: string;
}

export interface SaveUserConfigDialogResult {
    canceled: boolean;
    filePath?: string;
}
