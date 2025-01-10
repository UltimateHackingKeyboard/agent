import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { HOST_CONNECTION_COUNT_MAX } from 'uhk-common';

import { BleAddingState, BleAddingStates } from '../../../models';

@Component({
    selector: 'ble-pairing-panel',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './ble-pairing-panel.component.html',
    styleUrls: ['./ble-pairing-panel.component.scss']
})
export class BlePairingPanelComponent {
    @Input() state: BleAddingState;

    @Output() addNewPairedDevices = new EventEmitter<void>();

    protected readonly BlePairingStates = BleAddingStates;
    protected readonly faSpinner = faSpinner;
    protected readonly hostConnectionsMaxCount = HOST_CONNECTION_COUNT_MAX;
}
