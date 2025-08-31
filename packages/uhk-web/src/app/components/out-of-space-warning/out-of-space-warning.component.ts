import { Component, Input } from '@angular/core';

import { OutOfSpaceWarningData, OutOfSpaceWarningType } from '../../models';

@Component({
    selector: 'out-of-space-warning',
    standalone: false,
    templateUrl: './out-of-space-warning.component.html',
    styleUrls: ['./out-of-space-warning.component.scss']
})
export class OutOfSpaceWarningComponent {
    @Input() state: OutOfSpaceWarningData;

    outOfSpaceWarningType = OutOfSpaceWarningType;
}
