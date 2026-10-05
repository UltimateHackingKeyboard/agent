import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { SharedConfigApplyData } from 'uhk-common';

@Component({
    selector: 'shared-config-change-panel',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false,
    templateUrl: './shared-config-change-panel.component.html',
    styleUrls: ['./shared-config-change-panel.component.scss']
})
export class SharedConfigChangePanelComponent {
    @Input() change: SharedConfigApplyData;

    @Output() apply = new EventEmitter<void>();

    @Output() dismiss = new EventEmitter<void>();
}
