import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { UploadFileData } from 'uhk-common';

import { AppState, getConfigSizesState, getUserConfigHistoryComponentState, isUserConfigSaving } from '../../../store';
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
export class DeviceConfigurationComponent implements OnInit, OnDestroy {
    configSizesState$: Observable<UhkProgressBarState>;
    userConfigHistoryState$: Observable<UserConfigHistoryComponentState>;
    savingUserConfig: boolean;

    private subscription = new Subscription();

    constructor(private store: Store<AppState>) {
        this.configSizesState$ = this.store.select(getConfigSizesState);
        this.userConfigHistoryState$ = this.store.select(getUserConfigHistoryComponentState);
        this.subscription.add(this.store.select(isUserConfigSaving).subscribe(x => this.savingUserConfig = x));
    }

    ngOnInit(): void {
        this.store.dispatch(new ReadConfigSizesAction());
        this.store.dispatch(new LoadUserConfigurationHistoryAction());
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
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
