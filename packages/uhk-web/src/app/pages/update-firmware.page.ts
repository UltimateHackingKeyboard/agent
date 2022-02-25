import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';

import { AppState } from '../store';
import { SkipFirmwareUpgradeAction, UpdateFirmwareAction } from '../store/actions/device';

@Component({
    selector: 'update-firmware',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="uhk-message-wrapper">
            <div class="text-center">
                <h1>Update Firmware</h1>
                <p class="mt-3">Agent supports a new configuration format. If you want to save new configurations, you
                    must update the firmware.</p>
                <a class="btn btn-primary btn-lg mt-2"
                   routerLink="/device/firmware"
                   (click)="onUpdate()"
                >
                    Update Firmware
                </a>

            </div>
        </div>

        <div style="display: flex; justify-content: center; margin-top: 4rem">
            <a routerLink="/" (click)="onSkipFirmwareUpgrade()"> Skip firmware update </a>, and use Agent without saving new configurations.
        </div>
    `,
    styleUrls: ['../components/uhk-message/uhk-message.component.scss'],
    host: {
        'class': 'container-fluid vertical-center-component'
    }
})
export class UpdateFirmwarePageComponent {

    constructor(private store: Store<AppState>) {
    }

    onUpdate(): void {
        this.store.dispatch(new UpdateFirmwareAction(false));
    }

    onSkipFirmwareUpgrade(): void {
        this.store.dispatch(new SkipFirmwareUpgradeAction());
    }
}
