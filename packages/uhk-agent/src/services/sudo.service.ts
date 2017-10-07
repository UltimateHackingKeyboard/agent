import { ipcMain, app } from 'electron';
import * as isDev from 'electron-is-dev';
import * as path from 'path';
import * as sudo from 'sudo-prompt';

import { IpcEvents, LogService, IpcResponse } from 'uhk-common';

export class SudoService {
    private rootDir: string;

    constructor(private logService: LogService) {
        if (isDev) {
            this.rootDir = path.join(path.join(process.cwd(), process.argv[1]), '../../..');
        } else {
            this.rootDir = path.dirname(app.getAppPath());
        }
        this.logService.info('[SudoService] App root dir: ', this.rootDir);
        ipcMain.on(IpcEvents.device.setPrivilegeOnLinux, this.setPrivilege.bind(this));
    }

    private setPrivilege(event: Electron.Event) {
        switch (process.platform) {
            case 'linux':
                this.setPrivilegeOnLinux(event);
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

    private setPrivilegeOnLinux(event: Electron.Event) {
        const scriptPath = path.join(this.rootDir, 'rules/setup-rules.sh');
        const options = {
            name: 'Setting UHK access rules'
        };
        const command = `sh ${scriptPath}`;
        console.log(command);
        sudo.exec(command, options, (error: any) => {
            const response = new IpcResponse();

            if (error) {
                response.success = false;
                response.error = error;
            } else {
                response.success = true;
            }

            event.sender.send(IpcEvents.device.setPrivilegeOnLinuxReply, response);
        });
    }
}
