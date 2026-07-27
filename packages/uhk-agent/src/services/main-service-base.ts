import storage from 'electron-settings';
import { ApplicationSettings, LogService } from 'uhk-common';

export class MainServiceBase {
    constructor(protected logService: LogService,
                protected win: Electron.BrowserWindow) {}

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    protected sendIpcToWindow(message: string, arg?: any) {
        this.logService.misc('sendIpcToWindow:', message, arg);
        if (!this.win || this.win.isDestroyed()) {
            return;
        }

        this.win.webContents.send(message, arg);
    }

    protected async getApplicationSettings(): Promise<ApplicationSettings> {
        const value = await storage.get('application-settings');
        if (!value) {
            return {
                checkForUpdateOnStartUp: true,
                everAttemptedSavingToKeyboard: false
            };
        }

        return JSON.parse(<string>value);
    }

}
