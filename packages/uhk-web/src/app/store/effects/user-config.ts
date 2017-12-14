import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { defer } from 'rxjs/observable/defer';
import { Action, Store } from '@ngrx/store';
import { saveAs } from 'file-saver';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/empty';

import {
    ConfigurationReply, HardwareConfiguration, LogService, NotificationType, UhkBuffer,
    UserConfiguration
} from 'uhk-common';

import {
    ActionTypes, LoadConfigFromDeviceReplyAction, LoadUserConfigSuccessAction, RenameUserConfigurationAction,
    SaveUserConfigSuccessAction
} from '../actions/user-config';

import { DataStorageRepositoryService } from '../../services/datastorage-repository.service';
import { DefaultUserConfigurationService } from '../../services/default-user-configuration.service';
import { AppState, autoWriteUserConfiguration, getPrevUserConfiguration, getUserConfiguration } from '../index';
import { KeymapAction, KeymapActions, MacroAction, MacroActions } from '../actions';
import {
    DismissUndoNotificationAction, LoadHardwareConfigurationSuccessAction, ShowNotificationAction,
    UndoLastAction
} from '../actions/app';
import { SaveConfigurationAction, ShowSaveToKeyboardButtonAction } from '../actions/device';
import { DeviceRendererService } from '../../services/device-renderer.service';
import { UndoUserConfigData } from '../../models/undo-user-config-data';

@Injectable()
export class UserConfigEffects {

    private static getUserConfigFromDeviceResponse(json: string): UserConfiguration {
        const data = JSON.parse(json);
        const userConfig = new UserConfiguration();
        userConfig.fromBinary(UhkBuffer.fromArray(data));

        if (userConfig.userConfigMajorVersion > 0) {
            return userConfig;
        }

        return null;
    }

    private static getHardwareConfigFromDeviceResponse(json: string): HardwareConfiguration {
        const data = JSON.parse(json);
        const hardwareConfig = new HardwareConfiguration();
        hardwareConfig.fromBinary(UhkBuffer.fromArray(data));

        if (hardwareConfig.uniqueId > 0) {
            return hardwareConfig;
        }
        return null;
    }

    @Effect() loadUserConfig$: Observable<Action> = defer(() => {
        return Observable.of(new LoadUserConfigSuccessAction(this.getUserConfiguration()));
    });

    @Effect() saveUserConfig$: Observable<Action> = (this.actions$
        .ofType(
            KeymapActions.ADD, KeymapActions.DUPLICATE, KeymapActions.EDIT_NAME, KeymapActions.EDIT_ABBR,
            KeymapActions.SET_DEFAULT, KeymapActions.REMOVE, KeymapActions.SAVE_KEY,
            MacroActions.ADD, MacroActions.DUPLICATE, MacroActions.EDIT_NAME, MacroActions.REMOVE, MacroActions.ADD_ACTION,
            MacroActions.SAVE_ACTION, MacroActions.DELETE_ACTION, MacroActions.REORDER_ACTION,
            ActionTypes.RENAME_USER_CONFIGURATION) as
        Observable<KeymapAction | MacroAction | RenameUserConfigurationAction>)
        .withLatestFrom(this.store.select(getUserConfiguration), this.store.select(getPrevUserConfiguration))
        .mergeMap(([action, config, prevUserConfiguration]) => {
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
        });

    @Effect() undoUserConfig$: Observable<Action> = this.actions$
        .ofType<UndoLastAction>(KeymapActions.UNDO_LAST_ACTION)
        .map(action => action.payload)
        .mergeMap((payload: UndoUserConfigData) => {
            const config = new UserConfiguration().fromJsonObject(payload.config);
            this.dataStorageRepository.saveConfig(config);
            this.router.navigate([payload.path]);
            return [new LoadUserConfigSuccessAction(config)];
        });

    @Effect({dispatch: false}) loadConfigFromDevice$ = this.actions$
        .ofType(ActionTypes.LOAD_CONFIG_FROM_DEVICE)
        .do(() => this.deviceRendererService.loadConfigurationFromKeyboard());

    @Effect() loadConfigFromDeviceReply$ = this.actions$
        .ofType<LoadConfigFromDeviceReplyAction>(ActionTypes.LOAD_CONFIG_FROM_DEVICE_REPLY)
        .map(action => action.payload)
        .mergeMap((data: ConfigurationReply): any => {
            if (!data.success) {
                return [new ShowNotificationAction({
                    type: NotificationType.Error,
                    message: data.error
                })];
            }

            const result = [];
            try {
                const userConfig = UserConfigEffects.getUserConfigFromDeviceResponse(data.userConfiguration);
                result.push(new LoadUserConfigSuccessAction(userConfig));

            } catch (err) {
                this.logService.error('Eeprom user-config parse error:', err);
                result.push(
                    new ShowNotificationAction({
                        type: NotificationType.Error,
                        message: err
                    }));

                result.push(new LoadUserConfigSuccessAction(this.getUserConfiguration()));
            }

            try {
                const hardwareConfig = UserConfigEffects.getHardwareConfigFromDeviceResponse(data.hardwareConfiguration);
                result.push(new LoadHardwareConfigurationSuccessAction(hardwareConfig));
            } catch (err) {
                this.logService.error('Eeprom hardware-config parse error:', err);
                result.push(
                    new ShowNotificationAction({
                        type: NotificationType.Error,
                        message: err
                    }));
            }

            this.router.navigate(['/']);

            return result;
        });

    @Effect({dispatch: false}) saveUserConfigInJsonFile$ = this.actions$
        .ofType(ActionTypes.SAVE_USER_CONFIG_IN_JSON_FILE)
        .withLatestFrom(this.store.select(getUserConfiguration))
        .do(([action, userConfiguration]) => {
            const asString = JSON.stringify(userConfiguration.toJsonObject(), null, 2);
            const asBlob = new Blob([asString], {type: 'text/plain'});
            saveAs(asBlob, 'UserConfiguration.json');
        });

    @Effect({dispatch: false}) saveUserConfigInBinFile$ = this.actions$
        .ofType(ActionTypes.SAVE_USER_CONFIG_IN_BIN_FILE)
        .withLatestFrom(this.store.select(getUserConfiguration))
        .do(([action, userConfiguration]) => {
            const uhkBuffer = new UhkBuffer();
            userConfiguration.toBinary(uhkBuffer);
            const blob = new Blob([uhkBuffer.getBufferContent()]);
            saveAs(blob, 'UserConfiguration.bin');
        });

    @Effect() loadUserConfigurationSuccess$ = this.actions$
        .ofType(ActionTypes.SAVE_USER_CONFIG_SUCCESS)
        .withLatestFrom(this.store.select(autoWriteUserConfiguration))
        .switchMap(([action, autoWriteUserConfig]) => {
            if (autoWriteUserConfig) {
                return Observable.of(new SaveConfigurationAction());
            }
            else {
                return Observable.empty();
            }
        });

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
