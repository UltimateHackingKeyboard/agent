import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { UploadFileData } from 'uhk-common';

import { AppState, getConfigSizesState, getUserConfigHistoryState } from '../../../store';
import { ReadConfigSizesAction, ResetUserConfigurationAction } from '../../../store/actions/device';
import {
    LoadUserConfigurationFromFileAction,
    SaveUserConfigInBinaryFileAction,
    SaveUserConfigInJsonFileAction
} from '../../../store/actions/user-config';
import { UhkProgressBarState } from '../../../models/uhk-progress-bar-state';
import {
    GetUserConfigurationFromHistoryAction,
    LoadUserConfigurationHistoryAction
} from '../../../store/actions/user-configuration-history.actions';
import { State } from '../../../store/reducers/user-configuration-history.reducer';

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
    userConfigHistoryState$: Observable<State>;

    constructor(private store: Store<AppState>) {
        this.configSizesState$ = this.store.select(getConfigSizesState);
        this.userConfigHistoryState$ = this.store.select(getUserConfigHistoryState);
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
        this.store.dispatch(new LoadUserConfigurationFromFileAction(data));
    }

    getUserConfigFromHistory(fileName: string): void {
        this.store.dispatch(new GetUserConfigurationFromHistoryAction(fileName));
    }
}
