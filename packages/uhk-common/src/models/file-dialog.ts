export interface OpenUserConfigDialogResult {
    canceled: boolean;
    filePath?: string;
    data?: Array<number>;
    /**
     * True when the native open dialog never appeared, because the Linux
     * xdg-desktop-portal file chooser backend failed and aborted the request
     * (Chromium logs "Request ended (non-user cancelled)"). The caller should
     * fall back to the in-app picker, because Chromium's own file chooser (and
     * therefore the renderer's <input type="file">) goes through the same portal.
     */
    portalFailed?: boolean;
}

/**
 * A selectable user configuration file of the import folder, used by the
 * in-app picker that replaces the native open dialog when the Linux
 * xdg-desktop-portal file chooser is unavailable.
 */
export interface UserConfigFileInfo {
    name: string;
    path: string;
}

export interface ListUserConfigFilesResult {
    /**
     * The folder the files were listed from.
     */
    folder: string;
    files: UserConfigFileInfo[];
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
