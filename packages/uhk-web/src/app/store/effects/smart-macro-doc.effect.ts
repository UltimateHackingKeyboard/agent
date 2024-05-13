import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { distinctUntilChanged, map, startWith, tap, withLatestFrom } from 'rxjs/operators';
import { FirmwareRepoInfo } from 'uhk-common';

import { MonacoEditorCompletionItemProvider } from '../../services/monaco-editor-completion-item-provider';
import { SmartMacroDocRendererService } from '../../services/smart-macro-doc-renderer.service';
import { SmartMacroDocService } from '../../services/smart-macro-doc-service';
import * as Device from '../actions/device';
import * as AppActions from '../actions/app';
import { ActionTypes, ReferenceManualChangedAction } from '../actions/smart-macro-doc.action';
import { AppState, getRightModuleFirmwareRepoInfo, getSmartMacroDocModuleIds, runningInElectron } from '../index';

@Injectable()
export class SmartMacroDocEffect {
    appStart$ = createEffect(() => this.actions$
        .pipe(
            ofType(AppActions.ActionTypes.AppBootstrapped),
            startWith(new AppActions.AppStartedAction()),
            withLatestFrom(this.store.select(runningInElectron)),
            tap(async ([, electron]) => {
                if (!electron) {
                    const response = await fetch('https://raw.githubusercontent.com/UltimateHackingKeyboard/firmware/master/doc-dev/reference-manual.md');
                    if (response.ok) {
                        const text = await response.text();
                        this.completionItemProvider.setReferenceManual(text);
                    }
                }
            })
        ),
    { dispatch: false }
    );

    smartMacroDocInited$ = createEffect(() => this.actions$
        .pipe(
            ofType(ActionTypes.SmdInited, Device.ActionTypes.ModulesInfoLoaded, Device.ActionTypes.ConnectionStateChanged,
                Device.ActionTypes.UpdateFirmwareSuccess, Device.ActionTypes.UpdateFirmwareFailed),
            withLatestFrom(this.store.select(getSmartMacroDocModuleIds), this.store.select(getRightModuleFirmwareRepoInfo)),
            tap(([, modules, repoInfo]) => {
                this.sendMessageContext(modules, repoInfo);
                this.smartMacroDocRendererService.downloadDocumentation(repoInfo);
            })
        ),
    { dispatch: false }
    );

    referenceManualUpdated$ = createEffect(() => this.actions$
        .pipe(
            ofType(ActionTypes.ReferenceManualChanged),
            map((action: ReferenceManualChangedAction) => action.payload),
            distinctUntilChanged(),
            tap((referenceManual) => {
                this.completionItemProvider.setReferenceManual(referenceManual);
            })
        ),
    { dispatch: false }
    );

    constructor(private actions$: Actions,
                private completionItemProvider: MonacoEditorCompletionItemProvider,
                private smartMacroDocRendererService: SmartMacroDocRendererService,
                private smartMacroDocService: SmartMacroDocService,
                private store: Store<AppState>) {
    }

    private sendMessageContext(modulesIds: Array<number>, firmwareRepoInfo: FirmwareRepoInfo): void {
        this.smartMacroDocService.sendMessage({
            action: 'agent-message-context',
            firmwareRepoInfo,
            isRunningInAgent: true,
            modules: modulesIds,
            version: '1.0.0'
        });
    }
}
