export const SHARED_CONFIG_DEFAULT_FILE_NAME = 'SharedUserConfiguration.json';

export interface SharedConfigConfiguration {
    /**
     * Absolute path of the shared configuration file. Undefined disables the feature.
     */
    filePath?: string;
    /**
     * Whether Agent should watch the file and prompt to apply external changes.
     */
    detectChanges: boolean;
}

export interface SharedConfigWriteData {
    /**
     * Base64 encoded configuration file content.
     */
    content: string;
}

export interface SharedConfigAcknowledgeData {
    /**
     * Base64 encoded configuration file content that the user has acknowledged
     * (by applying or ignoring it).
     */
    content: string;
}

export interface SharedConfigApplyData {
    filePath: string;
    fileName: string;
    /**
     * Base64 encoded configuration file content.
     */
    content: string;
}
