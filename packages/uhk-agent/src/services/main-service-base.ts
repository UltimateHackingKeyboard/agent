import { LogService } from 'uhk-common';

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

}
