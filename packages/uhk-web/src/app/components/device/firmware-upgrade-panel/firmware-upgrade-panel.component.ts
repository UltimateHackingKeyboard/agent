import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'firmware-upgrade-panel',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './firmware-upgrade-panel.component.html',
    styleUrls: ['./firmware-upgrade-panel.component.scss']
})
export class FirmwareUpgradePanelComponent {
    @Output() updateFirmware = new EventEmitter<void>();
}
