class App {
    public static readonly appStarted = 'app-started';
    public static readonly getAppStartInfo = 'app-get-start-info';
    public static readonly getAppStartInfoReply = 'app-get-start-info-reply';
}

class AutoUpdate {
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

class Device {
    public static readonly setPrivilegeOnLinux = 'set-privilege-on-linux';
    public static readonly setPrivilegeOnLinuxReply = 'set-privilege-on-linux-reply';
    public static readonly deviceConnectionStateChanged = 'device-connection-state-changed';
    public static readonly saveUserConfiguration = 'device-save-user-configuration';
    public static readonly saveUserConfigurationReply = 'device-save-user-configuration-reply';
    public static readonly loadConfigurations = 'device-load-configuration';
    public static readonly loadConfigurationReply = 'device-load-configuration-reply';
    public static readonly updateFirmware = 'device-update-firmware';
    public static readonly updateFirmwareReply = 'device-update-firmware-reply';
}

export class IpcEvents {
    public static readonly app = App;
    public static readonly autoUpdater = AutoUpdate;
    public static readonly device = Device;
}
