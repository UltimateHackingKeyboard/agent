import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';

import {
    AppUpdateNotificationViewModel,
    initialAppUpdateNotificationViewModel,
} from '../../models/app-update-notification-view-model';

@Component({
    selector: 'app-update-available',
    standalone: false,
    templateUrl: './update-available.component.html',
    styleUrls: ['./update-available.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UpdateAvailableComponent {
    @Input() notification: AppUpdateNotificationViewModel = initialAppUpdateNotificationViewModel;

    @HostBinding('class.two-line')
    get isTwoLine(): boolean {
        return this.notification.updateDownloaded && this.notification.hasUnsavedChanges;
    }

    @Output() updateApp = new EventEmitter<null>();
    @Output() doNotUpdateApp = new EventEmitter<null>();
}
