import { ipcMain, app } from 'electron';
import * as isDev from 'electron-is-dev';
import * as path from 'path';
import * as sudo from 'sudo-prompt';
import { dirSync } from 'tmp';
import { emptyDir, copy } from 'fs-extra';

import { IpcEvents, LogService, IpcResponse } from 'uhk-common';

export class SudoService {
    private rootDir: string;

    constructor(private logService: LogService) {
        if (isDev) {
            this.rootDir = path.join(path.join(process.cwd(), process.argv[1]), '../../../../');
        } else {
            this.rootDir = path.dirname(app.getAppPath());
        }
        this.logService.info('[SudoService] App root dir: ', this.rootDir);
        ipcMain.on(IpcEvents.device.setPrivilegeOnLinux, this.setPrivilege.bind(this));
    }

    private async setPrivilege(event: Electron.Event) {
        switch (process.platform) {
            case 'linux':
                await this.setPrivilegeOnLinux(event);
                break;
            default:
                const response: IpcResponse = {
                    success: false,
                    error: { message: 'Permissions couldn\'t be set. Invalid platform: ' + process.platform }
                };

                event.sender.send(IpcEvents.device.setPrivilegeOnLinuxReply, response);
                break;
        }
    }

    private async setPrivilegeOnLinux(event: Electron.Event) {
        const tmpDirectory = dirSync();
        const rulesDir = path.join(this.rootDir, 'rules');
        this.logService.debug('[SudoService] Copy rules dir', { src: rulesDir, dst: tmpDirectory.name });
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
                response.error = error;
            } else {
                response.success = true;
            }

            await emptyDir(tmpDirectory.name);
            event.sender.send(IpcEvents.device.setPrivilegeOnLinuxReply, response);
        });
    }
}
