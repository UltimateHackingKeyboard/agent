import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { UpdateInfo } from '../../models/update-info';

@Component({
    selector: 'app-update-available',
    templateUrl: './update-available.component.html',
    styleUrls: ['./update-available.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UpdateAvailableComponent {
    @Input() updateInfo: UpdateInfo;

    @Output() updateApp = new EventEmitter<null>();
    @Output() doNotUpdateApp = new EventEmitter<null>();
}
