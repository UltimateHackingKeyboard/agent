import { BrowserWindow, ipcMain, shell } from 'electron';
import { UhkHidDevice } from 'uhk-usb';

import { AppStartInfo, IpcEvents, LogService } from 'uhk-common';
import { MainServiceBase } from './main-service-base';
import { DeviceService } from './device.service';
import { CommandLineInputs } from '../models/command-line-inputs';

export class AppService extends MainServiceBase {
    constructor(protected logService: LogService,
                protected win: Electron.BrowserWindow,
                private deviceService: DeviceService,
                private options: CommandLineInputs,
                private uhkHidDeviceService: UhkHidDevice) {
        super(logService, win);

        ipcMain.on(IpcEvents.app.getAppStartInfo, this.handleAppStartInfo.bind(this));
        ipcMain.on(IpcEvents.app.exit, this.exit.bind(this));
        ipcMain.on(IpcEvents.app.openUrl, this.openUrl.bind(this));
        logService.info('[AppService] init success');
    }

    private async handleAppStartInfo(event: Electron.Event) {
        this.logService.info('[AppService] getAppStartInfo');
        const deviceConnectionState = this.uhkHidDeviceService.getDeviceConnectionState();
        const response: AppStartInfo = {
            commandLineArgs: {
                addons: this.options.addons || false
            },
            deviceConnected: deviceConnectionState.connected,
            hasPermission: deviceConnectionState.hasPermission,
            bootloaderActive: deviceConnectionState.bootloaderActive
        };
        this.logService.info('[AppService] getAppStartInfo response:', response);
        return event.sender.send(IpcEvents.app.getAppStartInfoReply, response);
    }

    private exit() {
        this.logService.info('[AppService] exit');
        this.win.close();
    }

    private openUrl(event: Electron.Event, urls: Array<string>) {
        shell.openExternal(urls[0]);
    }
}
