import { ipcRenderer } from 'electron';

import { IpcCommonRenderer } from '../../app/services/ipc-common-renderer';

export class IpcUhkRenderer implements IpcCommonRenderer {
    public send(channel: string, ...args: any[]): void {
        ipcRenderer.send(channel, args);
    }

    public on(channel: string, listener: Function): this {
        ipcRenderer.on(channel, listener);
        return this;
    }

}
