import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { PrivilagePageSate } from '../../models/privilage-page-sate';

@Component({
    selector: 'linux-privilege-checker',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './linux-privilege-checker.component.html',
    styleUrls: ['./linux-privilege-checker.component.scss']
})
export class LinuxPrivilegeCheckerComponent {
    @Input() state: PrivilagePageSate;

    @Output() setUpPermissions = new EventEmitter<void>();
    @Output() whatWillThisDo = new EventEmitter<void>();
}
