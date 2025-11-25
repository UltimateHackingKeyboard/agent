import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { faPowerOff } from '@fortawesome/free-solid-svg-icons';

import { AppState } from '../../../store';
import { RebootDeviceAction } from '../../../store/actions/device';

@Component({
    selector: 'device-reboot-reset',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false,
    templateUrl: './reboot-device.component.html',
    styleUrls: ['./reboot-device.component.scss'],
    host: {
        'class': 'container-fluid full-screen-component'
    }
})
export class RebootDeviceComponent {
    faPowerOff = faPowerOff;

    constructor(private store: Store<AppState>) {
    }

    onRebootDevice(): void {
        this.store.dispatch(new RebootDeviceAction());
    }
}

