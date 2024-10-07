import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { UploadFileData } from 'uhk-common';
import { faSlidersH } from '@fortawesome/free-solid-svg-icons';

import { AppState,
    getConfigSizesProgressBarState,
    getRgbColorSpaceUsage,
    getUserConfigHistoryComponentState,
    hasRecoverableLEDSpace,
    isUserConfigSaving
} from '../../../store';
import { ResetUserConfigurationAction } from '../../../store/actions/device';
import {
    LoadUserConfigurationFromFileAction,
    SaveUserConfigInBinaryFileAction,
    RecoverLEDSpacesAction,
    SaveUserConfigInJsonFileAction,
} from '../../../store/actions/user-config';
import { UhkProgressBarState, UserConfigHistoryComponentState } from '../../../models';
import {
    ChangeUserConfigurationHistoryTabAction,
    GetUserConfigurationFromHistoryAction,
    LoadUserConfigurationHistoryAction
} from '../../../store/actions/user-configuration-history.actions';

@Component({
    selector: 'device-settings',
    templateUrl: './device-configuration.component.html',
    styleUrls: ['./device-configuration.component.scss'],
    host: {
        'class': 'container-fluid full-screen-component'
    }
})
export class DeviceConfigurationComponent implements OnInit, OnDestroy {
    hasRecoverableLEDSpace$: Observable<boolean>;
    configSizesProgressBarState$: Observable<UhkProgressBarState>;
    userConfigHistoryState$: Observable<UserConfigHistoryComponentState>;
    rgbColorSpaceUsage$: Observable<number>;
    savingUserConfig: boolean;
    faSlidersH = faSlidersH;

    private subscription = new Subscription();

    constructor(private store: Store<AppState>) {
        this.hasRecoverableLEDSpace$ = this.store.select(hasRecoverableLEDSpace);
        this.configSizesProgressBarState$ = this.store.select(getConfigSizesProgressBarState);
        this.userConfigHistoryState$ = this.store.select(getUserConfigHistoryComponentState);
        this.rgbColorSpaceUsage$ = this.store.select(getRgbColorSpaceUsage);
        this.subscription.add(this.store.select(isUserConfigSaving).subscribe(x => this.savingUserConfig = x));
    }

    ngOnInit(): void {
        this.store.dispatch(new LoadUserConfigurationHistoryAction());
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
        this.changeConfigHistoryTab(null);
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

    changeConfigHistoryTab(index: number | null) {
        this.store.dispatch(new ChangeUserConfigurationHistoryTabAction(index));
    }

    changeFile(data: UploadFileData): void {
        this.store.dispatch(new LoadUserConfigurationFromFileAction({
            uploadFileData: {
                ...data,
                saveInHistory: true
            },
            autoSave: false
        }));
    }

    getUserConfigFromHistory(fileName: string): void {
        this.store.dispatch(new GetUserConfigurationFromHistoryAction(fileName));
    }

    recoverLedSpaces(): void {
        this.store.dispatch(new RecoverLEDSpacesAction());
    }
}
