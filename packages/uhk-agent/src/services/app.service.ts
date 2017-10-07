import { ipcMain, BrowserWindow } from 'electron';
import { UhkHidDevice } from 'uhk-usb';

import { CommandLineArgs, IpcEvents, AppStartInfo, LogService } from 'uhk-common';
import { MainServiceBase } from './main-service-base';
import { DeviceService } from './device.service';

export class AppService extends MainServiceBase {
    constructor(protected logService: LogService,
                protected win: Electron.BrowserWindow,
                private deviceService: DeviceService,
                private options: CommandLineArgs,
                private uhkHidDeviceService: UhkHidDevice) {
        super(logService, win);

        ipcMain.on(IpcEvents.app.getAppStartInfo, this.handleAppStartInfo.bind(this));
        logService.info('AppService init success');
    }

    private handleAppStartInfo(event: Electron.Event) {
        this.logService.info('getStartInfo');
        const response: AppStartInfo = {
            commandLineArgs: this.options,
            deviceConnected: this.deviceService.isConnected,
            hasPermission: this.uhkHidDeviceService.hasPermission()
        };
        this.logService.info('getStartInfo response:', response);
        return event.sender.send(IpcEvents.app.getAppStartInfoReply, response);
    }
}
