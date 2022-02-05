import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { LogService } from 'uhk-common';

import { AppState } from '../store';
import { SmdAppendMacroAction, SmdInitedAction } from '../store/actions/smart-macro-doc.action';

@Injectable()
export class SmartMacroDocService implements OnDestroy {

    constructor(private store: Store<AppState>,
        private logService: LogService,
        private zone: NgZone) {
        window.addEventListener('message', this.onMessage.bind(this));
        window.addEventListener('messageerror', this.onMessageError.bind(this));
    }

    ngOnDestroy(): void {
        window.removeEventListener('message', this.onMessage.bind(this));
        window.removeEventListener('messageerror', this.onMessageError.bind(this));
    }

    private dispatchStoreAction(action: Action) {
        this.logService.misc(`[SmartMacroDocService] dispatch action: ${action.type}`);
        this.zone.run(() => this.store.dispatch(action));
    }

    private onMessageError(event: MessageEvent): void {
        console.error(event);
    }

    private onMessage(event: MessageEvent): void {
        switch (event.data.action) {
            case 'smd-inited':
                return this.dispatchStoreAction(new SmdInitedAction());

            case 'smd-append-macro': {
                return this.dispatchStoreAction(new SmdAppendMacroAction(event.data.data));
            }

            default: {
                break;
            }
        }
    }

}
