import { LogService } from 'uhk-common';

export class MainServiceBase {
    constructor(protected logService: LogService, protected win: Electron.BrowserWindow) {}

    protected sendIpcToWindow(message: string, arg?: any) {
        this.logService.info('sendIpcToWindow:', message, arg);
        if (!this.win || this.win.isDestroyed()) {
            return;
        }

        this.win.webContents.send(message, arg);
    }
}
