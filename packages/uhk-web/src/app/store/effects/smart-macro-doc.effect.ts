import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { tap, withLatestFrom } from 'rxjs/operators';

import { SmartMacroDocRendererService } from '../../services/smart-macro-doc-renderer.service';
import { SmartMacroDocService } from '../../services/smart-macro-doc-service';
import * as Device from '../actions/device';
import { ActionTypes } from '../actions/smart-macro-doc.action';
import { AppState, getSmartMacroDocModuleIds } from '../index';

@Injectable()
export class SmartMacroDocEffect {

    @Effect({ dispatch: false }) appStart$: Observable<Action> = this.actions$
        .pipe(
            ofType(ActionTypes.TogglePanelVisibility),
            tap(() => this.smartMacroDocRendererService.downloadDocumentation())
        );

    @Effect({ dispatch: false }) smartMacroDocInited$ = this.actions$
        .pipe(
            ofType(ActionTypes.SmdInited, Device.ActionTypes.ModulesInfoLoaded, Device.ActionTypes.ConnectionStateChanged,
                Device.ActionTypes.UpdateFirmwareSuccess, Device.ActionTypes.UpdateFirmwareFailed),
            withLatestFrom(this.store.select(getSmartMacroDocModuleIds)),
            tap(([, modules]) => this.sendMessageContext(modules))
        );

    constructor(private actions$: Actions,
                private smartMacroDocRendererService: SmartMacroDocRendererService,
                private smartMacroDocService: SmartMacroDocService,
                private store: Store<AppState>) {

    }

    private sendMessageContext(modulesIds: Array<number>): void {
        this.smartMacroDocService.sendMessage({
            action: 'agent-message-context',
            isRunningInAgent: true,
            modules: modulesIds,
            version: '1.0.0'
        });
    }
}
