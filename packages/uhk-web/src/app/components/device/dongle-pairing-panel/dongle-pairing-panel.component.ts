import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

import { DonglePairingStates } from '../../../models';

@Component({
    selector: 'dongle-pairing-panel',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './dongle-pairing-panel.component.html',
    styleUrls: ['./dongle-pairing-panel.component.scss']
})
export class DonglePairingPanelComponent {
    @Input() state: DonglePairingStates;

    @Output() pairDongle = new EventEmitter<void>();

    protected readonly DonglePairingStates = DonglePairingStates;
    protected readonly faSpinner = faSpinner;
}
