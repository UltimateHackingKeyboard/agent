import { Injectable, NgZone } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { ipcRenderer } from 'electron';

import { IpcEvents } from '../shared/util';
import { AppState } from '../store';
import { CommandLineArgs } from '../shared/models/command-line-args';
import { ProcessCommandLineArgsAction } from '../../../shared/src/store/actions/app.action';

@Injectable()
export class AppRendererService {
    constructor(private store: Store<AppState>,
                private zone: NgZone) {
        this.registerEvents();
    }

    getCommandLineArgs() {
        ipcRenderer.send(IpcEvents.app.getCommandLineArgs);
    }

    private registerEvents() {
        ipcRenderer.on(IpcEvents.app.getCommandLineArgsReply, (event: string, arg: CommandLineArgs) => {
            this.dispachStoreAction(new ProcessCommandLineArgsAction(arg));
        });
    }

    private dispachStoreAction(action: Action) {
        this.zone.run(() => this.store.dispatch(action));
    }
}
