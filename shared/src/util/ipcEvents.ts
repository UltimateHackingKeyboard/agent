class App {
    public static readonly appStarted = 'app-started';
}

class AutoUpdate {
    public static readonly checkingForUpdate = 'checking-for-update';
    public static readonly updateAvailable = 'update-available';
    public static readonly updateNotAvailable = 'update-not-available';
    public static readonly autoUpdateError = 'auto-update-error';
    public static readonly autoUpdateDownloaded = 'update-downloaded';
    public static readonly autoUpdateDownloadProgress = 'auto-update-download-progress';
    public static readonly updateAndRestart = 'update-and-restart';
}

export class IpcEvents {
    public static readonly app = App;
    public static readonly autoUpdater = AutoUpdate;
}
