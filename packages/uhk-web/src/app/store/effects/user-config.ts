import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { defer } from 'rxjs/observable/defer';
import { of } from 'rxjs/observable/of';
import { map, mergeMap, tap, withLatestFrom } from 'rxjs/operators';
import { Action, Store } from '@ngrx/store';
import { saveAs } from 'file-saver';

import {
    getHardwareConfigFromDeviceResponse,
    getUserConfigFromDeviceResponse,
    ConfigurationReply,
    LogService,
    NotificationType,
    UhkBuffer,
    UserConfiguration
} from 'uhk-common';

import {
    ActionTypes,
    ApplyUserConfigurationFromFileAction,
    LoadConfigFromDeviceReplyAction,
    LoadUserConfigSuccessAction,
    LoadUserConfigurationFromFileAction,
    RenameUserConfigurationAction,
    SaveUserConfigSuccessAction
} from '../actions/user-config';

import { DataStorageRepositoryService } from '../../services/datastorage-repository.service';
import { DefaultUserConfigurationService } from '../../services/default-user-configuration.service';
import { AppState, getPrevUserConfiguration, getRouterState, getUserConfiguration } from '../index';
import { KeymapAction, KeymapActions, MacroAction, MacroActions } from '../actions';
import {
    DismissUndoNotificationAction,
    LoadHardwareConfigurationSuccessAction,
    ShowNotificationAction,
    UndoLastAction
} from '../actions/app';
import {
    HardwareModulesLoadedAction,
    ShowSaveToKeyboardButtonAction,
    HasBackupUserConfigurationAction
} from '../actions/device';
import { DeviceRendererService } from '../../services/device-renderer.service';
import { UndoUserConfigData } from '../../models/undo-user-config-data';
import { UploadFileData } from '../../models/upload-file-data';

@Injectable()
export class UserConfigEffects {

    @Effect() loadUserConfig$: Observable<Action> = defer(() => {
        return of(new LoadUserConfigSuccessAction(this.getUserConfiguration()));
    });

    @Effect() saveUserConfig$: Observable<Action> = (this.actions$
        .ofType(
            KeymapActions.ADD, KeymapActions.DUPLICATE, KeymapActions.EDIT_NAME, KeymapActions.EDIT_ABBR,
            KeymapActions.SET_DEFAULT, KeymapActions.REMOVE, KeymapActions.SAVE_KEY, KeymapActions.EDIT_DESCRIPTION,
            MacroActions.ADD, MacroActions.DUPLICATE, MacroActions.EDIT_NAME, MacroActions.REMOVE, MacroActions.ADD_ACTION,
            MacroActions.SAVE_ACTION, MacroActions.DELETE_ACTION, MacroActions.REORDER_ACTION,
            ActionTypes.RENAME_USER_CONFIGURATION, ActionTypes.SET_USER_CONFIGURATION_VALUE
        ) as Observable<KeymapAction | MacroAction | RenameUserConfigurationAction>)
        .pipe(
            withLatestFrom(this.store.select(getUserConfiguration), this.store.select(getPrevUserConfiguration)),
            mergeMap(([action, config, prevUserConfiguration]) => {
                config.recalculateConfigurationLength();
                this.dataStorageRepository.saveConfig(config);

                if (action.type === KeymapActions.REMOVE || action.type === MacroActions.REMOVE) {
                    const text = action.type === KeymapActions.REMOVE ? 'Keymap' : 'Macro';
                    const pathPrefix = action.type === KeymapActions.REMOVE ? 'keymap' : 'macro';
                    const payload: UndoUserConfigData = {
                        path: `/${pathPrefix}/${action.payload}`,
                        config: prevUserConfiguration.toJsonObject()
                    };

                    return [
                        new SaveUserConfigSuccessAction(config),
                        new ShowNotificationAction({
                            type: NotificationType.Undoable,
                            message: `${text} has been deleted`,
                            extra: {
                                payload,
                                type: KeymapActions.UNDO_LAST_ACTION
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
        .ofType<UndoLastAction>(KeymapActions.UNDO_LAST_ACTION)
        .pipe(
            map(action => action.payload),
            mergeMap((payload: UndoUserConfigData) => {
                const config = new UserConfiguration().fromJsonObject(payload.config);
                this.dataStorageRepository.saveConfig(config);
                this.router.navigate([payload.path]);

                return [new LoadUserConfigSuccessAction(config)];
            })
        );

    @Effect({ dispatch: false }) loadConfigFromDevice$ = this.actions$
        .ofType(ActionTypes.LOAD_CONFIG_FROM_DEVICE)
        .pipe(
            tap(() => this.deviceRendererService.loadConfigurationFromKeyboard())
        );

    @Effect() loadConfigFromDeviceReply$ = this.actions$
        .ofType<LoadConfigFromDeviceReplyAction>(ActionTypes.LOAD_CONFIG_FROM_DEVICE_REPLY)
        .pipe(
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
                    result.push(new LoadUserConfigSuccessAction(userConfig));

                    if (route.state && !route.state.url.startsWith('/device/firmware')) {
                        newPageDestination = ['/'];
                    }

                } catch (err) {
                    this.logService.error('Eeprom user-config parse error:', err);
                    const userConfig = new UserConfiguration().fromJsonObject(data.backupConfiguration);

                    result.push(new HasBackupUserConfigurationAction(!!data.backupConfiguration));
                    result.push(new LoadUserConfigSuccessAction(userConfig));

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
                    this.router.navigate(newPageDestination);
                }

                return result;
            })
        );

    @Effect({ dispatch: false }) saveUserConfigInJsonFile$ = this.actions$
        .ofType(ActionTypes.SAVE_USER_CONFIG_IN_JSON_FILE)
        .pipe(
            withLatestFrom(this.store.select(getUserConfiguration)),
            tap(([action, userConfiguration]) => {
                const asString = JSON.stringify(userConfiguration.toJsonObject(), null, 2);
                const asBlob = new Blob([asString], { type: 'text/plain' });
                saveAs(asBlob, 'UserConfiguration.json');
            })
        );

    @Effect({ dispatch: false }) saveUserConfigInBinFile$ = this.actions$
        .ofType(ActionTypes.SAVE_USER_CONFIG_IN_BIN_FILE)
        .pipe(
            withLatestFrom(this.store.select(getUserConfiguration)),
            tap(([action, userConfiguration]) => {
                const uhkBuffer = new UhkBuffer();
                userConfiguration.toBinary(uhkBuffer);
                const blob = new Blob([uhkBuffer.getBufferContent()]);
                saveAs(blob, 'UserConfiguration.bin');
            })
        );

    @Effect() loadUserConfigurationFromFile$ = this.actions$
        .ofType<LoadUserConfigurationFromFileAction>(ActionTypes.LOAD_USER_CONFIGURATION_FROM_FILE)
        .pipe(
            map(action => action.payload),
            map((info: UploadFileData) => {
                try {
                    const userConfig = new UserConfiguration();

                    if (info.filename.endsWith('.bin')) {
                        userConfig.fromBinary(UhkBuffer.fromArray(info.data));
                    } else {
                        const buffer = new Buffer(info.data);
                        const json = buffer.toString();
                        userConfig.fromJsonObject(JSON.parse(json));
                    }

                    if (userConfig.userConfigMajorVersion) {
                        return new ApplyUserConfigurationFromFileAction(userConfig);
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
