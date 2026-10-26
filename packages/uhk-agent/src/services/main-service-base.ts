import { ApplicationSettings, LogService } from 'uhk-common';
import { getApplicationSettings } from '../util';

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
        return getApplicationSettings();
    }

}
