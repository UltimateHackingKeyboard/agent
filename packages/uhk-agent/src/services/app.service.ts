import { BrowserWindow, ipcMain } from 'electron';
import { UhkHidDevice } from 'uhk-usb';
import { readFile } from 'fs';
import { join } from 'path';

import { AppStartInfo, CommandLineArgs, IpcEvents, LogService } from 'uhk-common';
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
        logService.info('[AppService] init success');
    }

    private async handleAppStartInfo(event: Electron.Event) {
        this.logService.info('[AppService] getAppStartInfo');

        const packageJson = await this.getPackageJson();

        const response: AppStartInfo = {
            commandLineArgs: this.options,
            deviceConnected: this.deviceService.isConnected,
            hasPermission: this.uhkHidDeviceService.hasPermission(),
            agentVersionInfo: {
                version: packageJson.version,
                dataModelVersion: packageJson.dataModelVersion,
                usbProtocolVersion: packageJson.usbProtocolVersion,
                slaveProtocolVersion: packageJson.slaveProtocolVersion
            }
        };
        this.logService.info('[AppService] getAppStartInfo response:', response);
        return event.sender.send(IpcEvents.app.getAppStartInfoReply, response);
    }

    /**
     * Read the package.json that delivered with the bundle. Do not use require('package.json')
     * because the deploy process change the package.json after the build
     * @returns {Promise<any>}
     */
    private async getPackageJson(): Promise<any> {
        return new Promise((resolve, reject) => {
            readFile(join(__dirname, 'package.json'), {encoding: 'utf-8'}, (err, data) => {
                if (err) {
                    return reject(err);
                }

                resolve(JSON.parse(data));
            });
        });
    }
}
