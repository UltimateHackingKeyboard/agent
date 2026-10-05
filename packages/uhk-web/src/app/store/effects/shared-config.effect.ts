import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { EMPTY, from } from 'rxjs';
import { catchError, map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';

import { LogService } from 'uhk-common';

import { SharedConfigService } from '../../services/shared-config.service';
import {
    AppState,
    getDetectSharedConfigurationChanges,
    getHardwareModules,
    getSharedConfigChange,
    getSharedConfigurationFilePath,
    getUserConfiguration,
} from '../index';
import {
    ActionTypes,
    ApplySharedConfigChangeAction,
    DismissSharedConfigChangeAction,
    SharedConfigChangeDetectedAction,
} from '../actions/app';
import { ActionTypes as DeviceActionTypes } from '../actions/device';
import { LoadUserConfigurationFromFileAction } from '../actions/user-config';
import { updateUserConfigurationWithLastSaveInfo } from './user-config';

@Injectable()
export class SharedConfigEffects {
    private readonly actions$ = inject(Actions);
    private readonly logService = inject(LogService);
    private readonly sharedConfigService = inject(SharedConfigService);
    private readonly store = inject<Store<AppState>>(Store);

    configureSharedConfig$ = createEffect(() => this.actions$
        .pipe(
            ofType(
                ActionTypes.LoadApplicationSettingsSuccess,
                ActionTypes.SetSharedConfigurationFilePath,
                ActionTypes.SetDetectSharedConfigurationChanges
            ),
            withLatestFrom(
                this.store.select(getSharedConfigurationFilePath),
                this.store.select(getDetectSharedConfigurationChanges)
            ),
            switchMap(([, filePath, detectChanges]) => from(
                this.sharedConfigService.configure(filePath, detectChanges)
            ).pipe(
                catchError(error => {
                    this.logService.error('[SharedConfigEffects] Failed to configure the shared configuration', error);
                    return EMPTY;
                })
            ))
        ),
    { dispatch: false }
    );

    exportSharedConfig$ = createEffect(() => this.actions$
        .pipe(
            ofType(DeviceActionTypes.SaveToKeyboardSuccess),
            withLatestFrom(
                this.store.select(getSharedConfigurationFilePath),
                this.store.select(getUserConfiguration),
                this.store.select(getHardwareModules)
            ),
            switchMap(([, filePath, userConfiguration, hardwareModules]) => {
                if (!filePath) {
                    return EMPTY;
                }

                const newUserConfiguration = updateUserConfigurationWithLastSaveInfo(
                    userConfiguration,
                    hardwareModules.rightModuleInfo
                );
                const asString = JSON.stringify(newUserConfiguration.toJsonObject(), null, 2);
                const data = new TextEncoder().encode(asString);

                return from(this.sharedConfigService.write(data)).pipe(
                    catchError(error => {
                        this.logService.error('[SharedConfigEffects] Failed to export the shared configuration', error);
                        return EMPTY;
                    })
                );
            })
        ),
    { dispatch: false }
    );

    detectSharedConfigChange$ = createEffect(() => this.sharedConfigService.changeDetected$
        .pipe(
            map(data => new SharedConfigChangeDetectedAction(data))
        )
    );

    applySharedConfigChange$ = createEffect(() => this.actions$
        .pipe(
            ofType<ApplySharedConfigChangeAction>(ActionTypes.ApplySharedConfigChange),
            withLatestFrom(this.store.select(getSharedConfigChange)),
            mergeMap(([, change]) => {
                if (!change) {
                    return [];
                }

                return [
                    new LoadUserConfigurationFromFileAction({
                        uploadFileData: {
                            filename: change.fileName,
                            data: Array.from(base64ToUint8Array(change.content)),
                            saveInHistory: true,
                        },
                        autoSave: false,
                    }),
                    new DismissSharedConfigChangeAction(),
                ];
            })
        )
    );
}

function base64ToUint8Array(base64: string): Uint8Array {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);

    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }

    return bytes;
}
