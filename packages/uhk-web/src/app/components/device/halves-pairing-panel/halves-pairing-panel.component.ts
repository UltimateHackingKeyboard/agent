import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'halves-pairing-panel',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false,
    templateUrl: './halves-pairing-panel.component.html',
    styleUrls: ['./halves-pairing-panel.component.scss']
})
export class HalvesPairingPanelComponent {
    @Input() isPairing: boolean;

    @Output() pairHalves = new EventEmitter<void>();

    protected readonly faSpinner = faSpinner;
}
