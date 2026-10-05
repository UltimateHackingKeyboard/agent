import { Injectable, NgZone, inject } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { FirmwareRepoInfo, IpcEvents, LogService } from 'uhk-common';

import { AppState } from '../store';
import { ReferenceManualChangedAction } from '../store/actions/smart-macro-doc.action';
import { DownloadDocumentationSuccessAction, ServiceListeningAction } from '../store/actions/smart-macro-doc.action';
import { IpcCommonRenderer } from './ipc-common-renderer';

@Injectable()
export class SmartMacroDocRendererService {
    private readonly ipcRenderer = inject(IpcCommonRenderer);
    private readonly logService = inject(LogService);
    private readonly store = inject<Store<AppState>>(Store);
    private readonly zone = inject(NgZone);

    constructor() {
        this.registerEvents();
        this.logService.misc('[SmartMacroDocRendererService] init success');
    }

    public downloadDocumentation(firmwareRepoInfo: FirmwareRepoInfo): void {
        this.logService.misc('[SmartMacroDocRendererService] downloadDocumentation');
        this.ipcRenderer.send(IpcEvents.smartMacroDoc.downloadDocumentation, firmwareRepoInfo);
    }

    private registerEvents(): void {
        this.ipcRenderer.on(IpcEvents.smartMacroDoc.serviceListening, (event: string, arg: number) => {
            this.dispatchStoreAction(new ServiceListeningAction(arg));
        });

        this.ipcRenderer.on(IpcEvents.smartMacroDoc.downloadDocumentationReply, (event : string, firmwareRepoInfo: FirmwareRepoInfo) => {
            this.dispatchStoreAction(new DownloadDocumentationSuccessAction(firmwareRepoInfo));
        });

        this.ipcRenderer.on(IpcEvents.smartMacroDoc.referenceManualReply, (event: string, arg: string) => {
            this.dispatchStoreAction(new ReferenceManualChangedAction(arg));
        });
    }

    private dispatchStoreAction(action: Action) {
        this.logService.misc(`[SmartMacroDocRendererService] dispatch action: ${action.type}`);
        this.zone.run(() => this.store.dispatch(action));
    }
}
