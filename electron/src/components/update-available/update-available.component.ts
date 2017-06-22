import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-update-available',
    templateUrl: './update-available.component.html',
    styleUrls: ['./update-available.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UpdateAvailableComponent {
    @Input() showUpdateAvailable: boolean = false;
    @Output() updateApp = new EventEmitter<null>();
    @Output() doNotUpdateApp = new EventEmitter<null>();
}
