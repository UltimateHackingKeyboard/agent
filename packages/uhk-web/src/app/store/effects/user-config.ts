import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { defer, Observable, of } from 'rxjs';
import { map, mergeMap, tap, withLatestFrom } from 'rxjs/operators';
import { Action, Store } from '@ngrx/store';
import { saveAs } from 'file-saver';
import { Buffer } from 'buffer/';

import {
    getHardwareConfigFromDeviceResponse,
    getUserConfigFromDeviceResponse,
    ConfigurationReply,
    LogService,
    NotificationType,
    UhkBuffer,
    UploadFileData,
    UserConfiguration
} from 'uhk-common';

import {
    ActionTypes,
    ApplyUserConfigurationFromFileAction,
    LoadConfigFromDeviceReplyAction,
    LoadUserConfigSuccessAction,
    LoadUserConfigurationFromFileAction, PreviewUserConfigurationAction,
    SaveUserConfigSuccessAction
} from '../actions/user-config';

import { DataStorageRepositoryService } from '../../services/datastorage-repository.service';
import { DefaultUserConfigurationService } from '../../services/default-user-configuration.service';
import { AppState, getPrevUserConfiguration, getRouterState, getUserConfiguration } from '../index';
import * as Keymaps from '../actions/keymap';
import * as Macros from '../actions/macro';
import {
    DismissUndoNotificationAction,
    LoadHardwareConfigurationSuccessAction,
    ShowNotificationAction,
    UndoLastAction,
    NavigateTo
} from '../actions/app';
import {
    HardwareModulesLoadedAction,
    ShowSaveToKeyboardButtonAction,
    HasBackupUserConfigurationAction
} from '../actions/device';
import { DeviceRendererService } from '../../services/device-renderer.service';
import { UndoUserConfigData } from '../../models/undo-user-config-data';
import { LoadUserConfigurationFromFilePayload } from '../../models';

@Injectable()
export class UserConfigEffects {

    @Effect() loadUserConfig$: Observable<Action> = defer(() => {
        return of(new LoadUserConfigSuccessAction(this.getUserConfiguration()));
    });

    @Effect() saveUserConfig$: Observable<Action> = this.actions$
        .pipe(
            ofType(
                Keymaps.ActionTypes.Add, Keymaps.ActionTypes.Duplicate, Keymaps.ActionTypes.EditName,
                Keymaps.ActionTypes.EditAbbr, Keymaps.ActionTypes.SetDefault, Keymaps.ActionTypes.Remove,
                Keymaps.ActionTypes.SaveKey, Keymaps.ActionTypes.EditDescription, Keymaps.ActionTypes.ExchangeKeys,
                Macros.ActionTypes.Add, Macros.ActionTypes.Duplicate, Macros.ActionTypes.EditName, Macros.ActionTypes.Remove,
                Macros.ActionTypes.AddAction, Macros.ActionTypes.SaveAction, Macros.ActionTypes.DeleteAction,
                Macros.ActionTypes.ReorderAction,
                ActionTypes.RenameUserConfiguration, ActionTypes.SetUserConfigurationValue
            ),
            withLatestFrom(this.store.select(getUserConfiguration), this.store.select(getPrevUserConfiguration)),
            mergeMap(([action, config, prevUserConfiguration]) => {
                config = Object.assign(new UserConfiguration(), config);
                config.recalculateConfigurationLength();
                this.dataStorageRepository.saveConfig(config);

                if (action.type === Keymaps.ActionTypes.Remove || action.type === Macros.ActionTypes.Remove) {
                    const text = action.type === Keymaps.ActionTypes.Remove ? 'Keymap' : 'Macro';
                    const pathPrefix = action.type === Keymaps.ActionTypes.Remove ? 'keymap' : 'macro';
                    const payload: UndoUserConfigData = {
                        path: `/${pathPrefix}/${(action as Keymaps.RemoveKeymapAction | Macros.RemoveMacroAction).payload}`,
                        config: prevUserConfiguration.toJsonObject()
                    };

                    return [
                        new SaveUserConfigSuccessAction(config),
                        new ShowNotificationAction({
                            type: NotificationType.Undoable,
                            message: `${text} has been deleted`,
                            extra: {
                                payload,
                                type: Keymaps.ActionTypes.UndoLastAction
                            }
                        }),
                        new ShowSaveToKeyboardButtonAction()
                    ];
                }

                return [
                    new SaveUserConfigSuccessAction(config),
                    new DismissUndoNotificationAction(),
                    new ShowSaveToKeyboardButtonAction()
                ];
            })
        );

    @Effect() undoUserConfig$: Observable<Action> = this.actions$
        .pipe(
            ofType<UndoLastAction>(Keymaps.ActionTypes.UndoLastAction),
            map(action => action.payload),
            mergeMap((payload: UndoUserConfigData) => {
                const config = new UserConfiguration().fromJsonObject(payload.config);
                this.dataStorageRepository.saveConfig(config);
                this.router.navigate([payload.path]);

                return [new LoadUserConfigSuccessAction(config)];
            })
        );

    @Effect({ dispatch: false }) loadConfigFromDevice$ = this.actions$
        .pipe(
            ofType(ActionTypes.LoadConfigFromDevice),
            tap(() => this.deviceRendererService.loadConfigurationFromKeyboard())
        );

    @Effect() loadConfigFromDeviceReply$ = this.actions$
        .pipe(
            ofType<LoadConfigFromDeviceReplyAction>(ActionTypes.LoadConfigFromDeviceReply),
            withLatestFrom(this.store.select(getRouterState)),
            mergeMap(([action, route]): any => {
                const data: ConfigurationReply = action.payload;

                if (!data.success) {
                    return [new ShowNotificationAction({
                        type: NotificationType.Error,
                        message: data.error
                    })];
                }

                const result = [];
                let newPageDestination: Array<string>;

                try {
                    const userConfig = getUserConfigFromDeviceResponse(data.userConfiguration);
                    this.logService.config('[UserConfigEffect] Loaded user configuration', userConfig);
                    result.push(new LoadUserConfigSuccessAction(userConfig));

                    if (route.state && !route.state.url.startsWith('/device/firmware')) {
                        newPageDestination = ['/'];
                    }

                } catch (err) {
                    this.logService.error('Eeprom user-config parse error:', err);
                    if (data.backupConfiguration) {
                        const userConfig = new UserConfiguration().fromJsonObject(data.backupConfiguration);
                        result.push(new HasBackupUserConfigurationAction(true));
                        result.push(new LoadUserConfigSuccessAction(userConfig));
                    } else {
                        result.push(new HasBackupUserConfigurationAction(false));
                    }

                    newPageDestination = ['/device/restore-user-configuration'];
                }

                try {
                    const hardwareConfig = getHardwareConfigFromDeviceResponse(data.hardwareConfiguration);
                    result.push(new LoadHardwareConfigurationSuccessAction(hardwareConfig));
                } catch (err) {
                    this.logService.error('Eeprom hardware-config parse error:', err);
                    result.push(
                        new ShowNotificationAction({
                            type: NotificationType.Error,
                            message: err
                        }));
                }

                result.push(new HardwareModulesLoadedAction(data.modules));

                if (newPageDestination) {
                    result.push(new NavigateTo({ commands: newPageDestination }));
                }

                return result;
            })
        );

    @Effect({ dispatch: false }) saveUserConfigInJsonFile$ = this.actions$
        .pipe(
            ofType(ActionTypes.SaveUserConfigInJsonFile),
            withLatestFrom(this.store.select(getUserConfiguration)),
            tap(([action, userConfiguration]) => {
                const asString = JSON.stringify(userConfiguration.toJsonObject(), null, 2);
                const asBlob = new Blob([asString], { type: 'text/plain' });
                saveAs(asBlob, 'UserConfiguration.json');
            })
        );

    @Effect({ dispatch: false }) saveUserConfigInBinFile$ = this.actions$
        .pipe(
            ofType(ActionTypes.SaveUserConfigInBinFile),
            withLatestFrom(this.store.select(getUserConfiguration)),
            tap(([action, userConfiguration]) => {
                const uhkBuffer = new UhkBuffer();
                userConfiguration.toBinary(uhkBuffer);
                const blob = new Blob([uhkBuffer.getBufferContent()]);
                saveAs(blob, 'UserConfiguration.bin');
            })
        );

    @Effect() loadUserConfigurationFromFile$ = this.actions$
        .pipe(
            ofType<LoadUserConfigurationFromFileAction>(ActionTypes.LoadUserConfigurationFromFile),
            map(action => action.payload),
            map((payload: LoadUserConfigurationFromFilePayload) => {
                try {
                    const userConfig = new UserConfiguration();

                    if (payload.uploadFileData.filename.endsWith('.bin')) {
                        userConfig.fromBinary(UhkBuffer.fromArray(payload.uploadFileData.data));
                    } else {
                        const buffer = Buffer.from(payload.uploadFileData.data);
                        const json = buffer.toString();
                        userConfig.fromJsonObject(JSON.parse(json));
                    }

                    if (userConfig.userConfigMajorVersion) {
                        if (payload.autoSave) {
                            return new ApplyUserConfigurationFromFileAction({
                                userConfig,
                                saveInHistory: payload.uploadFileData.saveInHistory
                            });
                        } else {
                            return new PreviewUserConfigurationAction(userConfig);
                        }
                    }

                    return new ShowNotificationAction({
                        type: NotificationType.Error,
                        message: 'Invalid configuration specified.'
                    });
                } catch (err) {
                    return new ShowNotificationAction({
                        type: NotificationType.Error,
                        message: 'Invalid configuration specified.'
                    });
                }
            })
        );

    @Effect() previewUserConfiguration$ = this.actions$
        .pipe(
            ofType<PreviewUserConfigurationAction>(ActionTypes.PreviewUserConfiguration),
            map(() => new ShowSaveToKeyboardButtonAction())
        );

    constructor(private actions$: Actions,
                private dataStorageRepository: DataStorageRepositoryService,
                private store: Store<AppState>,
                private defaultUserConfigurationService: DefaultUserConfigurationService,
                private deviceRendererService: DeviceRendererService,
                private logService: LogService,
                private router: Router) {
    }

    private getUserConfiguration() {
        const configJsonObject = this.dataStorageRepository.getConfig();
        let config: UserConfiguration;

        if (configJsonObject) {
            if (configJsonObject.userConfigMajorVersion ===
                this.defaultUserConfigurationService.getDefault().userConfigMajorVersion) {
                config = new UserConfiguration().fromJsonObject(configJsonObject);
            }
        }

        if (!config) {
            config = this.defaultUserConfigurationService.getDefault();
        }

        return config;

    }
}
