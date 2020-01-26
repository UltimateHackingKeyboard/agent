import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { UploadFileData } from 'uhk-common';

import { AppState, getConfigSizesState, getUserConfigHistoryComponentState } from '../../../store';
import { ReadConfigSizesAction, ResetUserConfigurationAction } from '../../../store/actions/device';
import {
    LoadUserConfigurationFromFileAction,
    SaveUserConfigInBinaryFileAction,
    SaveUserConfigInJsonFileAction
} from '../../../store/actions/user-config';
import { UhkProgressBarState, UserConfigHistoryComponentState } from '../../../models';
import {
    GetUserConfigurationFromHistoryAction,
    LoadUserConfigurationHistoryAction
} from '../../../store/actions/user-configuration-history.actions';

@Component({
    selector: 'device-settings',
    templateUrl: './device-configuration.component.html',
    styleUrls: ['./device-configuration.component.scss'],
    host: {
        'class': 'container-fluid'
    }
})
export class DeviceConfigurationComponent implements OnInit {
    configSizesState$: Observable<UhkProgressBarState>;
    userConfigHistoryState$: Observable<UserConfigHistoryComponentState>;

    constructor(private store: Store<AppState>) {
        this.configSizesState$ = this.store.select(getConfigSizesState);
        this.userConfigHistoryState$ = this.store.select(getUserConfigHistoryComponentState);
    }

    ngOnInit(): void {
        this.store.dispatch(new ReadConfigSizesAction());
        this.store.dispatch(new LoadUserConfigurationHistoryAction());
    }

    resetUserConfiguration() {
        this.store.dispatch(new ResetUserConfigurationAction());
    }

    saveConfigurationInJSONFormat() {
        this.store.dispatch(new SaveUserConfigInJsonFileAction());
    }

    saveConfigurationInBINFormat() {
        this.store.dispatch(new SaveUserConfigInBinaryFileAction());
    }

    exportUserConfiguration(event: MouseEvent) {
        if (event.shiftKey) {
            this.saveConfigurationInBINFormat();
        } else {
            this.saveConfigurationInJSONFormat();
        }
    }

    changeFile(data: UploadFileData): void {
        this.store.dispatch(new LoadUserConfigurationFromFileAction({
            ...data,
            saveInHistory: true
        }));
    }

    getUserConfigFromHistory(fileName: string): void {
        this.store.dispatch(new GetUserConfigurationFromHistoryAction(fileName));
    }
}
