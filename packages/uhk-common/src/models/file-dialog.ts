export interface OpenUserConfigDialogResult {
    canceled: boolean;
    filePath?: string;
    data?: Array<number>;
    /**
     * True when the native open dialog never appeared, because the Linux
     * xdg-desktop-portal file chooser backend failed and aborted the request
     * (Chromium logs "Request ended (non-user cancelled)"). The caller should
     * fall back to a non-portal file picker.
     */
    portalFailed?: boolean;
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
     * (Chromium logs "Request ended (non-user cancelled)"). The file was then
     * written by Agent to the fallback folder instead of a user-chosen one.
     */
    savedWithoutDialog?: boolean;
}

export interface SelectSharedConfigDialogResult {
    canceled: boolean;
    filePath?: string;
}
