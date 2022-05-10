import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { CommandMacroAction, LogService } from 'uhk-common';
import { Subject, Subscription } from 'rxjs';

import { AppState, getSelectedMacroAction, getSmartMacroDocModuleIds } from '../store';
import { SmdInitedAction } from '../store/actions/smart-macro-doc.action';
import { SelectedMacroAction, SelectedMacroActionId, TabName } from '../models';

export enum SmartMacroDocCommandAction {
    insert,
    set
}

export interface SmartMacroDocCommand {
    action: SmartMacroDocCommandAction;
    data: string;
    macroActionId: SelectedMacroActionId;
}

@Injectable()
export class SmartMacroDocService implements OnDestroy {
    smartMacroDocCommand = new Subject<SmartMacroDocCommand>();
    selectedMacroAction: SelectedMacroAction;
    smartMacroDocModuleIds: Array<number> = [];

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
                    this.dispatchMacroEditorFocusEvent();
                })
        );

        this.subscriptions.add(
            store.select(getSmartMacroDocModuleIds)
                .subscribe(moduleIds => {
                    this.smartMacroDocModuleIds = moduleIds;
                    this.dispatchMacroEditorFocusEvent();
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
        this.dispatchMacroEditorFocusEvent();
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
            case 'doc-message-inited': {
                this.dispatchMacroEditorFocusEvent();

                return this.dispatchStoreAction(new SmdInitedAction());
            }

            case 'doc-message-insert-macro':
                return this.dispatchSmartMacroDocCommand(SmartMacroDocCommandAction.insert, event.data.command);

            case 'doc-message-set-macro':
                return this.dispatchSmartMacroDocCommand(SmartMacroDocCommandAction.set, event.data.command);

            default: {
                break;
            }
        }
    }

    private dispatchSmartMacroDocCommand(action: SmartMacroDocCommandAction, data: any): void {
        if (!this.selectedMacroAction) {
            return;
        }

        this.smartMacroDocCommand.next({
            action,
            data,
            macroActionId: this.selectedMacroAction.id
        });
    }

    private dispatchMacroEditorFocusEvent(): void {
        if (!this.iframe?.contentWindow) {
            return;
        }

        const message = {
            action: 'agent-message-editor-lost-focus',
            command: '',
            modules: this.smartMacroDocModuleIds,
            version: '1.0.0'
        };

        if (this.selectedMacroAction?.type === TabName.Command) {
            message.action = 'agent-message-editor-got-focus';
            message.command = (this.selectedMacroAction.macroAction as CommandMacroAction).command;
        }

        this.iframe.contentWindow.postMessage(message, '*');
    }
}
