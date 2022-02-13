import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { LogService } from 'uhk-common';
import { Subject, Subscription } from 'rxjs';

import { AppState, getSelectedMacroAction } from '../store';
import { SmdInitedAction } from '../store/actions/smart-macro-doc.action';
import { SelectedMacroAction, SelectedMacroActionId, TabName } from '../models';

export interface InsertMacroCommand {
    data: string;
    macroActionId: SelectedMacroActionId;
}

@Injectable()
export class SmartMacroDocService implements OnDestroy {
    insertMacroCommand = new Subject<InsertMacroCommand>();
    selectedMacroAction: SelectedMacroAction;

    private subscriptions = new Subscription();
    private iframe: HTMLIFrameElement;

    constructor(private store: Store<AppState>,
                private logService: LogService,
                private zone: NgZone) {
        window.addEventListener('message', this.onMessage.bind(this));
        window.addEventListener('messageerror', this.onMessageError.bind(this));

        this.subscriptions.add(
            store.select(getSelectedMacroAction)
                .subscribe(action => {
                    this.selectedMacroAction = action;
                    this.toggleMacroEditorInFocus();
                })
        );
    }

    ngOnDestroy(): void {
        window.removeEventListener('message', this.onMessage.bind(this));
        window.removeEventListener('messageerror', this.onMessageError.bind(this));
        this.subscriptions.unsubscribe();
    }

    setIframe(iframe: HTMLIFrameElement): void {
        this.iframe = iframe;
        this.toggleMacroEditorInFocus();
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
            case 'smd-inited': {
                this.toggleMacroEditorInFocus();

                return this.dispatchStoreAction(new SmdInitedAction());
            }

            case 'smd-insert-macro': {
                if (!this.selectedMacroAction) {
                    return;
                }

                return this.insertMacroCommand.next({
                    data: event.data.data,
                    macroActionId: this.selectedMacroAction.id
                });
            }

            default: {
                break;
            }
        }
    }

    private toggleMacroEditorInFocus(): void {
        if (!this.iframe?.contentWindow) {
            return;
        }

        const action = this.selectedMacroAction?.type === TabName.Command
            ? 'sma-editor-got-focus'
            : 'sma-editor-lost-focus';

        this.iframe.contentWindow.postMessage({ action }, '*');
    }
}
