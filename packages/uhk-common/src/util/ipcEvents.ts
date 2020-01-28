export class App {
    public static readonly appStarted = 'app-started';
    public static readonly getAppStartInfo = 'app-get-start-info';
    public static readonly getAppStartInfoReply = 'app-get-start-info-reply';
    public static readonly exit = 'app-exit';
    public static readonly openUrl = 'open-url';
}

export class AutoUpdate {
    public static readonly checkingForUpdate = 'checking-for-update';
    public static readonly updateAvailable = 'update-available';
    public static readonly updateNotAvailable = 'update-not-available';
    public static readonly autoUpdateError = 'auto-update-error';
    public static readonly autoUpdateDownloaded = 'update-downloaded';
    public static readonly autoUpdateDownloadProgress = 'auto-update-download-progress';
    public static readonly updateAndRestart = 'update-and-restart';
    public static readonly checkForUpdate = 'check-for-update';
    public static readonly checkForUpdateNotAvailable = 'check-for-update-not-available';
}

export class Device {
    public static readonly setPrivilegeOnLinux = 'set-privilege-on-linux';
    public static readonly setPrivilegeOnLinuxReply = 'set-privilege-on-linux-reply';
    public static readonly deviceConnectionStateChanged = 'device-connection-state-changed';
    public static readonly saveUserConfiguration = 'device-save-user-configuration';
    public static readonly saveUserConfigurationReply = 'device-save-user-configuration-reply';
    public static readonly loadConfigurations = 'device-load-configuration';
    public static readonly loadConfigurationReply = 'device-load-configuration-reply';
    public static readonly updateFirmware = 'device-update-firmware';
    public static readonly updateFirmwareReply = 'device-update-firmware-reply';
    public static readonly startConnectionPoller = 'device-start-connection-poller';
    public static readonly recoveryDevice = 'device-recovery';
    public static readonly enableUsbStackTest = 'enable-usb-stack-test';
    public static readonly readConfigSizes = 'device-read-config-sizes';
    public static readonly readConfigSizesReply = 'device-read-config-sizes-reply';
    public static readonly loadUserConfigHistory = 'device-load-user-config-history';
    public static readonly loadUserConfigHistoryReply = 'device-load-user-config-history-reply';
    public static readonly getUserConfigFromHistory = 'device-get-user-config-from-history';
    public static readonly getUserConfigFromHistoryReply = 'device-get-user-config-from-history-reply';
}

export class IpcEvents {
    public static readonly app = App;
    public static readonly autoUpdater = AutoUpdate;
    public static readonly device = Device;
}
