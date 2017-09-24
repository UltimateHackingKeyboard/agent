export interface ConfigurationReply {
    success: boolean;
    userConfiguration?: string;
    hardwareConfiguration?: string;
    error?: string;
}
