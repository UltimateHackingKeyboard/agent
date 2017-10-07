import { Component } from '@angular/core';
import { Store } from '@ngrx/store';

import { AppState } from '../../../store';
import { ResetUserConfigurationAction } from '../../../store/actions/device';

@Component({
    selector: 'device-settings',
    templateUrl: './device-settings.component.html',
    styleUrls: ['./device-settings.component.scss'],
    host: {
        'class': 'container-fluid'
    }
})
export class DeviceSettingsComponent {

    constructor(private store: Store<AppState>) {
    }

    resetUserConfiguration() {
        this.store.dispatch(new ResetUserConfigurationAction());
    }
}
