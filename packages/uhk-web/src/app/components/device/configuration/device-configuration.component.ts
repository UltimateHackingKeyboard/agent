import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { BacklightingMode, UploadFileData } from 'uhk-common';
import { faSlidersH } from '@fortawesome/free-solid-svg-icons';

import { AppState,
    backlightingMode,
    getConfigSizesProgressBarState,
    getRgbColorSpaceUsage,
    getUserConfigHistoryComponentState,
    isUserConfigSaving
} from '../../../store';
import { ResetUserConfigurationAction } from '../../../store/actions/device';
import {
    LoadUserConfigurationFromFileAction,
    SaveUserConfigInBinaryFileAction,
    SaveUserConfigInJsonFileAction,
    SetUserConfigurationValueAction
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
        'class': 'container-fluid full-screen-component'
    }
})
export class DeviceConfigurationComponent implements OnInit, OnDestroy {
    backlightingModeEnum = BacklightingMode;
    backlightingMode$: Observable<BacklightingMode>;
    configSizesProgressBarState$: Observable<UhkProgressBarState>;
    userConfigHistoryState$: Observable<UserConfigHistoryComponentState>;
    rgbColorSpaceUsage$: Observable<number>;
    savingUserConfig: boolean;
    faSlidersH = faSlidersH;

    private subscription = new Subscription();

    constructor(private store: Store<AppState>) {
        this.backlightingMode$ = this.store.select(backlightingMode);
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
        this.store.dispatch(new SetUserConfigurationValueAction({
            propertyName: 'backlightingMode',
            value: BacklightingMode.FunctionalBacklighting
        }));
    }
}
