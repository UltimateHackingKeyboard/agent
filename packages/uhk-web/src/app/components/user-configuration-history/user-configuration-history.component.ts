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
    @Output() deleteUserConfigHistory = new EventEmitter<number>();

    showDeleteUserConfigHistoryPopoverIndex: number

    onDeletePopoverOpenChange(isOpen: boolean, tabIndex: number): void {
        if (!isOpen && this.showDeleteUserConfigHistoryPopoverIndex === tabIndex) {
            this.showDeleteUserConfigHistoryPopoverIndex = -1
        }
    }

    onTabContextmenuClick(tabIndex: number): void {
        this.showDeleteUserConfigHistoryPopoverIndex = tabIndex;
    }

    trackByFn(index: number, key: HistoryFileInfo): string {
        return key.file;
    }

    onSelectTab(index: number): void {
        this.changeTab.emit(index);
    }
}
