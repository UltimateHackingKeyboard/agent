import { ipcRenderer } from 'electron';

import { IpcCommonRenderer } from '../../app/services/ipc-common-renderer';

export class IpcUhkRenderer implements IpcCommonRenderer {
    public send(channel: string, ...args: any[]): void {
        ipcRenderer.send(channel, args);
    }

    public on(channel: string, listener: (event: Electron.IpcRendererEvent, ...args: any[]) => void): this {
        ipcRenderer.on(channel, listener);
        return this;
    }

}
