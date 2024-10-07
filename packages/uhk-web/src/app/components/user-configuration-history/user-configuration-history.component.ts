import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { HistoryFileInfo, UserConfigHistoryComponentState } from '../../models';

@Component({
    selector: 'user-configuration-history',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './user-configuration-history.component.html',
    styleUrls: ['./user-configuration-history.component.scss']
})
export class UserConfigurationHistoryComponent {
    @Input() state: UserConfigHistoryComponentState;

    @Output() getUserConfigFromHistory = new EventEmitter<string>();
    @Output() changeTab = new EventEmitter<number>();

    trackByFn(index: number, key: HistoryFileInfo): string {
        return key.file;
    }

    onSelectTab(index: number): void {
        this.changeTab.emit(index);
    }
}
