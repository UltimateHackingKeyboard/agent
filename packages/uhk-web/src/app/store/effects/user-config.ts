import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType, ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { routerNavigatedAction, RouterNavigatedAction } from '@ngrx/router-store';
import { Observable } from 'rxjs';
import { distinctUntilChanged, filter, map, mergeMap, switchMap, tap, withLatestFrom, } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { saveAs } from 'file-saver';

import {
    BackupUserConfigurationInfo,
    Buffer,
    getHardwareConfigFromDeviceResponse,
    getUserConfigFromDeviceResponse,
    ConfigurationReply,
    LogService,
    NotificationType,
    UhkBuffer,
    UHK_MODULES,
    UserConfiguration
} from 'uhk-common';

import { EmptyAction } from '../actions/app';
import {
    ActionTypes,
    ApplyUserConfigurationFromFileAction,
    LoadConfigFromDeviceReplyAction,
    LoadUserConfigSuccessAction,
    LoadUserConfigurationFromFileAction,
    NavigateToModuleSettings,
    PreviewUserConfigurationAction,
    SaveUserConfigSuccessAction,
    SelectModuleConfigurationAction
} from '../actions/user-config';

import { DataStorageRepositoryService } from '../../services/datastorage-repository.service';
import { DefaultUserConfigurationService } from '../../services/default-user-configuration.service';
import { getVersions } from '../../util';
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
    BackupUserConfigurationAction
} from '../actions/device';
import { DeviceRendererService } from '../../services/device-renderer.service';
import { UndoUserConfigData } from '../../models/undo-user-config-data';
import { LoadUserConfigurationFromFilePayload } from '../../models';
import { RouterState } from '../router-util.js';

@Injectable()
export class UserConfigEffects {

    loadUserConfig$ = createEffect(() => this.actions$
        .pipe(
            ofType(ROOT_EFFECTS_INIT),
            switchMap(() => this.getUserConfiguration()
                .pipe(
                    map(userConfig => new LoadUserConfigSuccessAction(userConfig))
                )
            )
        )
    );

    saveUserConfig$ = createEffect(() => this.actions$
        .pipe(
            ofType(
                Keymaps.ActionTypes.Add, Keymaps.ActionTypes.Duplicate, Keymaps.ActionTypes.EditName,
                Keymaps.ActionTypes.EditAbbr, Keymaps.ActionTypes.SetDefault, Keymaps.ActionTypes.Remove,
                Keymaps.ActionTypes.SaveKey, Keymaps.ActionTypes.EditDescription, Keymaps.ActionTypes.ExchangeKeys,
                Keymaps.ActionTypes.AddLayer, Keymaps.ActionTypes.RemoveLayer, Keymaps.ActionTypes.SetKeyColor,
                Macros.ActionTypes.Add, Macros.ActionTypes.Duplicate, Macros.ActionTypes.EditName, Macros.ActionTypes.Remove,
                Macros.ActionTypes.AddAction, Macros.ActionTypes.SaveAction, Macros.ActionTypes.DeleteAction,
                Macros.ActionTypes.ReorderAction,
                ActionTypes.RenameUserConfiguration, ActionTypes.SetUserConfigurationValue, ActionTypes.SetUserConfigurationRgbValue,
                ActionTypes.RecoverLEDSpaces, ActionTypes.SetModuleConfigurationValue
            ),
            withLatestFrom(this.store.select(getUserConfiguration), this.store.select(getPrevUserConfiguration)),
            mergeMap(([action, config, prevUserConfiguration]) => {
                config = Object.assign(new UserConfiguration(), config);
                config.recalculateConfigurationLength();

                return this.dataStorageRepository.saveConfig(config)
                    .pipe(
                        mergeMap(() => {
                            if (action.type === Keymaps.ActionTypes.Remove || action.type === Macros.ActionTypes.Remove) {
                                const text = action.type === Keymaps.ActionTypes.Remove ? 'Keymap' : 'Macro';
                                const pathPrefix = action.type === Keymaps.ActionTypes.Remove ? 'keymap' : 'macro';
                                const payload: UndoUserConfigData = {
                                    path: `/${pathPrefix}/${(action as Keymaps.RemoveKeymapAction | Macros.RemoveMacroAction).payload}`,
                                    config: prevUserConfiguration.clone()
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
            })
        )
    );

    undoUserConfig$ = createEffect(() => this.actions$
        .pipe(
            ofType<UndoLastAction>(Keymaps.ActionTypes.UndoLastAction),
            map(action => action.payload),
            switchMap((payload: UndoUserConfigData) => this.dataStorageRepository.saveConfig(payload.config)
                .pipe(
                    tap(() => this.router.navigate([payload.path])),
                    map(() => new LoadUserConfigSuccessAction(payload.config))
                )
            )
        )
    );

    loadConfigFromDevice$ = createEffect(() => this.actions$
        .pipe(
            ofType(ActionTypes.LoadConfigFromDevice),
            tap(() => this.deviceRendererService.loadConfigurationFromKeyboard(getVersions()))
        ),
    { dispatch: false }
    );

    loadConfigFromDeviceReply$ = createEffect(() => this.actions$
        .pipe(
            ofType<LoadConfigFromDeviceReplyAction>(ActionTypes.LoadConfigFromDeviceReply),
            withLatestFrom(this.store.select(getRouterState)),
            mergeMap(([action, route]) => {
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

                    if (route.state
                        && !route.state.url.startsWith('/device/firmware')
                        && !route.state.url.startsWith('/update-firmware')) {
                        newPageDestination = ['/'];
                    }

                } catch (err) {
                    this.logService.error('Eeprom user-config parse error:', err);
                    result.push(new BackupUserConfigurationAction(data.backupConfiguration));
                    if (data.backupConfiguration.info === BackupUserConfigurationInfo.LastCompatible
                        || data.backupConfiguration.info === BackupUserConfigurationInfo.EarlierCompatible) {
                        const userConfig = new UserConfiguration().fromJsonObject(data.backupConfiguration.userConfiguration);
                        result.push(new LoadUserConfigSuccessAction(userConfig));
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
        )
    );

    saveUserConfigInJsonFile$ = createEffect(() => this.actions$
        .pipe(
            ofType(ActionTypes.SaveUserConfigInJsonFile),
            withLatestFrom(this.store.select(getUserConfiguration)),
            tap(([action, userConfiguration]) => {
                const asString = JSON.stringify(userConfiguration.toJsonObject(), null, 2);
                const asBlob = new Blob([asString], { type: 'text/plain' });
                saveAs(asBlob, 'UserConfiguration.json');
            })
        ),
    { dispatch: false }
    );

    saveUserConfigInBinFile$ = createEffect(() => this.actions$
        .pipe(
            ofType(ActionTypes.SaveUserConfigInBinFile),
            withLatestFrom(this.store.select(getUserConfiguration)),
            tap(([action, userConfiguration]) => {
                const uhkBuffer = new UhkBuffer();
                userConfiguration.toBinary(uhkBuffer);
                const blob = new Blob([uhkBuffer.getBufferContent()]);
                saveAs(blob, 'UserConfiguration.bin');
            })
        ),
    { dispatch: false }
    );

    loadUserConfigurationFromFile$ = createEffect(() => this.actions$
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
        )
    );

    navigateToModuleSettings$ = createEffect(() => this.actions$
        .pipe(
            ofType(ActionTypes.NavigateToModuleSettings),
            tap((action: NavigateToModuleSettings) => {
                for(const module of UHK_MODULES) {
                    if (module.id === action.payload) {
                        this.router.navigate([module.configPath]);
                        return;
                    }
                }
            })
        ),
    { dispatch: false }
    );

    previewUserConfiguration$ = createEffect(() => this.actions$
        .pipe(
            ofType<PreviewUserConfigurationAction>(ActionTypes.PreviewUserConfiguration),
            map(() => new ShowSaveToKeyboardButtonAction())
        )
    );

    moduleConfigurationNavigated$ = createEffect(() => this.actions$
        .pipe(
            ofType(routerNavigatedAction),
            map<RouterNavigatedAction, RouterState>(action => action.payload.routerState as any),
            filter(routerState => routerState.url.startsWith('/add-on')),
            map(routerState => {
                const uhkModule = UHK_MODULES.find(module => module.configPath === routerState.pathname);

                if (uhkModule) {
                    return new SelectModuleConfigurationAction(uhkModule.id);
                }

                return new EmptyAction();
            }),
            distinctUntilChanged(),
        ));

    constructor(private actions$: Actions,
                private dataStorageRepository: DataStorageRepositoryService,
                private store: Store<AppState>,
                private defaultUserConfigurationService: DefaultUserConfigurationService,
                private deviceRendererService: DeviceRendererService,
                private logService: LogService,
                private router: Router) {
    }

    private getUserConfiguration(): Observable<UserConfiguration> {
        return this.dataStorageRepository.getConfig()
            .pipe(
                map(configJsonObject => {
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
                })
            );
    }
}
