/* eslint-disable @typescript-eslint/no-explicit-any */
import { IpcCommonRenderer } from '../../app/services/ipc-common-renderer';

export class IpcUhkRenderer implements IpcCommonRenderer {
    public send(channel: string, ...args: any[]): void {
        (window as any).electron.ipcRenderer.send(channel, args);
    }

    public on(channel: string, listener: (_, ...args: any[]) => void): this {
        (window as any).electron.ipcRenderer.on(channel, listener);
        return this;
    }

}
