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
    /**
     * True when the native save dialog never appeared, because the Linux
     * xdg-desktop-portal file chooser backend failed and aborted the request
     * (Chromium logs "Request ended (non-user cancelled)"). The caller should
     * fall back to a non-portal save method.
     */
    portalFailed?: boolean;
}

export interface SelectSharedConfigDialogResult {
    canceled: boolean;
    filePath?: string;
}
