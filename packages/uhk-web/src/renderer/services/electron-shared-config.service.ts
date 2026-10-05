/* eslint-disable @typescript-eslint/no-explicit-any */
import { Subject } from 'rxjs';

import { IpcEvents, SharedConfigApplyData } from 'uhk-common';

import { SharedConfigService } from '../../app/services/shared-config.service';

export class ElectronSharedConfigService extends SharedConfigService {
    private readonly changeDetectedSubject = new Subject<SharedConfigApplyData>();

    readonly changeDetected$ = this.changeDetectedSubject.asObservable();

    constructor() {
        super();

        (window as any).electron.ipcRenderer.on(
            IpcEvents.sharedConfig.changeDetected,
            (_event: unknown, data: SharedConfigApplyData) => this.changeDetectedSubject.next(data)
        );
    }

    configure(filePath: string | undefined, detectChanges: boolean): Promise<void> {
        return (window as any).electron.ipcRenderer.invoke(IpcEvents.sharedConfig.configure, {
            filePath,
            detectChanges,
        }) as Promise<void>;
    }

    write(data: Uint8Array): Promise<void> {
        return (window as any).electron.ipcRenderer.invoke(IpcEvents.sharedConfig.write, {
            content: toBase64(data),
        }) as Promise<void>;
    }

    acknowledge(content?: string): Promise<void> {
        if (!content) {
            return Promise.resolve();
        }

        return (window as any).electron.ipcRenderer.invoke(IpcEvents.sharedConfig.acknowledge, {
            content,
        }) as Promise<void>;
    }
}

function toBase64(data: Uint8Array): string {
    let binary = '';
    const chunkSize = 0x8000;

    for (let i = 0; i < data.length; i += chunkSize) {
        binary += String.fromCharCode(...data.subarray(i, i + chunkSize));
    }

    return btoa(binary);
}
