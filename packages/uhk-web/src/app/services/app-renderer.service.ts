import { Injectable, NgZone } from '@angular/core';
import { Action, Store } from '@ngrx/store';

import { IpcEvents, CommandLineArgs } from 'uhk-common';
import { AppState } from '../store/index';
import { ProcessCommandLineArgsAction } from '../store/actions/app';
import { IpcCommonRenderer } from './ipc-common-renderer';

@Injectable()
export class AppRendererService {
    constructor(private store: Store<AppState>,
                private zone: NgZone,
                private ipcRenderer: IpcCommonRenderer) {
        this.registerEvents();
    }

    getCommandLineArgs() {
        this.ipcRenderer.send(IpcEvents.app.getCommandLineArgs);
    }

    private registerEvents() {
        this.ipcRenderer.on(IpcEvents.app.getCommandLineArgsReply, (event: string, arg: CommandLineArgs) => {
            this.dispachStoreAction(new ProcessCommandLineArgsAction(arg));
        });
    }

    private dispachStoreAction(action: Action) {
        this.zone.run(() => this.store.dispatch(action));
    }
}
