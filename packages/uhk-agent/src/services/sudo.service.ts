import { ipcMain } from 'electron';
import * as path from 'path';
import * as sudo from 'sudo-prompt';
import { dirSync } from 'tmp';
import { emptyDir, copy } from 'fs-extra';

import { CommandLineArgs, IpcEvents, LogService, IpcResponse } from 'uhk-common';
import { DeviceService } from './device.service';

export class SudoService {

    constructor(private logService: LogService,
                private options: CommandLineArgs,
                private deviceService: DeviceService,
                private rootDir: string) {
        this.logService.info('[SudoService] App root dir: ', this.rootDir);
        ipcMain.on(IpcEvents.device.setPrivilegeOnLinux, this.setPrivilege.bind(this));
    }

    private async setPrivilege(event: Electron.IpcMainEvent) {
        if (this.options.spe) {
            const error = new Error('No polkit authentication agent found.');
            this.logService.error('[SudoService] Simulate privilege escalation error ', error);

            const response = new IpcResponse();
            response.success = false;
            response.error = {message: error.message};

            event.sender.send(IpcEvents.device.setPrivilegeOnLinuxReply, response);

            return;
        }

        switch (process.platform) {
            case 'linux':
                await this.setPrivilegeOnLinux(event);
                break;
            default:
                const response: IpcResponse = {
                    success: false,
                    error: {message: 'Permissions couldn\'t be set. Invalid platform: ' + process.platform}
                };

                event.sender.send(IpcEvents.device.setPrivilegeOnLinuxReply, response);
                break;
        }
    }

    private async setPrivilegeOnLinux(event: Electron.IpcMainEvent) {
        await this.deviceService.stopPollUhkDevice();
        const tmpDirectory = dirSync();
        const rulesDir = path.join(this.rootDir, 'rules');
        this.logService.debug('[SudoService] Copy rules dir', {src: rulesDir, dst: tmpDirectory.name});
        await copy(rulesDir, tmpDirectory.name);

        const scriptPath = path.join(tmpDirectory.name, 'setup-rules.sh');

        const options = {
            name: 'Setting UHK access rules'
        };
        const command = `sh ${scriptPath}`;
        this.logService.debug('[SudoService] Set privilege command: ', command);
        sudo.exec(command, options, async (error: any) => {
            const response = new IpcResponse();

            if (error) {
                this.logService.error('[SudoService] Error when set privilege: ', error);
                response.success = false;
                response.error = {message: error.message};
            } else {
                response.success = true;
            }

            await emptyDir(tmpDirectory.name);
            this.deviceService.startPollUhkDevice();
            event.sender.send(IpcEvents.device.setPrivilegeOnLinuxReply, response);
        });
    }
}
