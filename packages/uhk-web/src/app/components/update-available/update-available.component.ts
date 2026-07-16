import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'app-update-available',
    standalone: false,
    templateUrl: './update-available.component.html',
    styleUrls: ['./update-available.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UpdateAvailableComponent {
    protected readonly agentChangelogUrl =
        'https://github.com/UltimateHackingKeyboard/agent/blob/master/CHANGELOG.md';

    @Output() updateApp = new EventEmitter<null>();
    @Output() doNotUpdateApp = new EventEmitter<null>();
}
