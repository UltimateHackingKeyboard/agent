import { Component } from '@angular/core';
import { Store } from '@ngrx/store';

import { AppState } from '../../../store';
import { ResetUserConfigurationAction } from '../../../store/actions/device';
import {
    LoadUserConfigurationFromFileAction,
    SaveUserConfigInBinaryFileAction,
    SaveUserConfigInJsonFileAction
} from '../../../store/actions/user-config';

@Component({
    selector: 'device-settings',
    templateUrl: './device-configuration.component.html',
    styleUrls: ['./device-configuration.component.scss'],
    host: {
        'class': 'container-fluid'
    }
})
export class DeviceConfigurationComponent {

    constructor(private store: Store<AppState>) {
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

    changeFile(event): void {
        const files = event.srcElement.files;
        const fileReader = new FileReader();
        fileReader.onloadend = function () {
            const arrayBuffer = new Uint8Array(fileReader.result);
            this.store.dispatch(new LoadUserConfigurationFromFileAction({
                filename: event.srcElement.value,
                data: Array.from(arrayBuffer)
            }));
        }.bind(this);
        fileReader.readAsArrayBuffer(files[0]);
    }
}
