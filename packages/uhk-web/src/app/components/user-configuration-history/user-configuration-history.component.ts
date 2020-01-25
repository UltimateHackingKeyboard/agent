import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { State } from '../../store/reducers/user-configuration-history.reducer';

@Component({
    selector: 'user-configuration-history',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './user-configuration-history.component.html'
})
export class UserConfigurationHistoryComponent {
    @Input() state: State;
    @Output() getUserConfigFromHistory = new EventEmitter<string>();

    trackByFn(index: number, key: string): string {
        return key;
    }
}
