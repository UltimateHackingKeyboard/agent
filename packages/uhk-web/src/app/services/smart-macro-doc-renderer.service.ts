import { Injectable, NgZone } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { IpcEvents, LogService } from 'uhk-common';

import { AppState } from '../store';
import { DownloadDocumentationSuccessAction, ServiceListeningAction } from '../store/actions/smart-macro-doc.action';
import { IpcCommonRenderer } from './ipc-common-renderer';

@Injectable()
export class SmartMacroDocRendererService {
    constructor(private store: Store<AppState>,
                private ipcRenderer: IpcCommonRenderer,
                private logService: LogService,
                private zone: NgZone) {
        this.registerEvents();
        this.logService.misc('[SmartMacroDocRendererService] init success');
    }

    public downloadDocumentation(): void {
        this.logService.misc('[SmartMacroDocRendererService] downloadDocumentation');
        this.ipcRenderer.send(IpcEvents.smartMacroDoc.downloadDocumentation);
    }

    private registerEvents(): void {
        this.ipcRenderer.on(IpcEvents.smartMacroDoc.serviceListening, (event: string, arg: number) => {
            this.dispatchStoreAction(new ServiceListeningAction(arg));
        });

        this.ipcRenderer.on(IpcEvents.smartMacroDoc.downloadDocumentationReply, () => {
            this.dispatchStoreAction(new DownloadDocumentationSuccessAction());
        });
    }

    private dispatchStoreAction(action: Action) {
        this.logService.misc(`[SmartMacroDocRendererService] dispatch action: ${action.type}`);
        this.zone.run(() => this.store.dispatch(action));
    }
}
