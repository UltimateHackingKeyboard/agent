import { ipcMain } from 'electron';
import { cp, rm } from 'node:fs/promises';
import path from 'node:path';
import * as sudo from '@vscode/sudo-prompt';

import { CommandLineArgs, IpcEvents, LogService, IpcResponse } from 'uhk-common';
import { makeTmpDir } from 'uhk-fs';

import { DeviceService } from './device.service';

export class SudoService {

    constructor(private logService: LogService,
                private options: CommandLineArgs,
                private deviceService: DeviceService,
                private rootDir: string) {
        this.logService.misc('[SudoService] App root dir: ', this.rootDir);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
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
            case 'linux': {
                await this.setPrivilegeOnLinux(event);
                break;
            }

            default: {
                const response: IpcResponse = {
                    success: false,
                    error: { message: 'Permissions couldn\'t be set. Invalid platform: ' + process.platform }
                };

                event.sender.send(IpcEvents.device.setPrivilegeOnLinuxReply, response);
                break;
            }
        }
    }

    private async setPrivilegeOnLinux(event: Electron.IpcMainEvent) {
        await this.deviceService.stopPollUhkDevice();
        const tmpDirectory = await makeTmpDir();
        const rulesDir = path.join(this.rootDir, 'rules');
        this.logService.misc('[SudoService] Copy rules dir', {src: rulesDir, dst: tmpDirectory});
        await cp(rulesDir, tmpDirectory, { recursive: true, force: true });

        const scriptPath = path.join(tmpDirectory, 'setup-rules.sh');

        const options = {
            name: 'Setting UHK access rules'
        };
        const command = `sh ${scriptPath}`;
        this.logService.misc('[SudoService] Set privilege command: ', command);
        sudo.exec(command, options, (error: Error) => {
            const response = new IpcResponse();

            if (error) {
                this.logService.error('[SudoService] Error when set privilege: ', error);
                response.success = false;
                response.error = {message: error.message};
            } else {
                response.success = true;
            }

            rm(tmpDirectory, { recursive: true, force: true })
                .then(() => {
                    this.deviceService.startPollUhkDevice();
                    event.sender.send(IpcEvents.device.setPrivilegeOnLinuxReply, response);
                })
                .catch((error) => {
                    this.logService.error('[SudoService] Error when removing tmp directory: ', error);
                });
        });
    }
}
