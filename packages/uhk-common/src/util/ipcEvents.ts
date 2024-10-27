export class App {
    public static readonly appStarted = 'app-started';
    public static readonly getAppStartInfo = 'app-get-start-info';
    public static readonly getAppStartInfoReply = 'app-get-start-info-reply';
    public static readonly exit = 'app-exit';
    public static readonly openConfigFolder = 'open-config-folder';
    public static readonly openUrl = 'open-url';
    public static readonly getConfig = 'app-get-config';
    public static readonly setConfig = 'app-set-config';
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
    public static readonly changeKeyboardLayout = 'device-change-keyboard-layout';
    public static readonly changeKeyboardLayoutReply = 'device-change-keyboard-layout-reply';
    public static readonly hardwareModulesLoaded = 'device-hardware-modules-loaded';
    public static readonly setPrivilegeOnLinux = 'set-privilege-on-linux';
    public static readonly setPrivilegeOnLinuxReply = 'set-privilege-on-linux-reply';
    public static readonly deviceConnectionStateChanged = 'device-connection-state-changed';
    public static readonly saveUserConfiguration = 'device-save-user-configuration';
    public static readonly saveUserConfigurationReply = 'device-save-user-configuration-reply';
    public static readonly loadConfigurations = 'device-load-configuration';
    public static readonly loadConfigurationReply = 'device-load-configuration-reply';
    public static readonly updateFirmware = 'device-update-firmware';
    public static readonly updateFirmwareJson = 'device-update-firmware-json';
    public static readonly updateFirmwareReply = 'device-update-firmware-reply';
    public static readonly moduleFirmwareUpgradeSkip = 'device-module-firmware-upgrade-skip';
    public static readonly moduleFirmwareUpgrading = 'device-module-firmware-upgrading';
    public static readonly startConnectionPoller = 'device-start-connection-poller';
    public static readonly recoveryDevice = 'device-recovery';
    public static readonly recoveryDeviceReply = 'device-recovery-reply';
    public static readonly recoveryModule = 'device-module';
    public static readonly recoveryModuleReply = 'device-module-reply';
    public static readonly enableUsbStackTest = 'enable-usb-stack-test';
    public static readonly readConfigSizes = 'device-read-config-sizes';
    public static readonly readConfigSizesReply = 'device-read-config-sizes-reply';
    public static readonly loadUserConfigHistory = 'device-load-user-config-history';
    public static readonly loadUserConfigHistoryReply = 'device-load-user-config-history-reply';
    public static readonly getUserConfigFromHistory = 'device-get-user-config-from-history';
    public static readonly getUserConfigFromHistoryReply = 'device-get-user-config-from-history-reply';
    public static readonly statusBufferChanged = 'device-status-buffer-changed';
    public static readonly toggleI2cDebugging = 'device-toggle-i2c-debugging';
    public static readonly deleteHostConnection = 'device-delete-host-connection';
    public static readonly deleteHostConnectionSuccess = 'device-delete-host-connection-success';
    public static readonly deleteHostConnectionFailed = 'device-delete-host-connection-failed';
    public static readonly startDonglePairing = 'device-start-dongle-pairing';
    public static readonly donglePairingSuccess = 'device-dongle-pairing-success';
    public static readonly donglePairingFailed = 'device-dongle-pairing-failed';
    public static readonly i2cWatchdogCounterChanged = 'device-i2c-watchdog-counter-changed';
}

export class SmartMacroDoc {
    public static readonly downloadDocumentation = 'smart-macro-doc-service-download-documentation';
    public static readonly downloadDocumentationReply = 'smart-macro-doc-service-download-documentation-reply';
    public static readonly referenceManualReply = 'smart-macro-doc-service-reference-manual-reply';
    public static readonly serviceListening = 'smart-macro-doc-service-listening';
}

export class IpcEvents {
    public static readonly app = App;
    public static readonly autoUpdater = AutoUpdate;
    public static readonly device = Device;
    public static readonly smartMacroDoc = SmartMacroDoc;
}
