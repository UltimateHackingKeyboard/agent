import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

import { State } from '../../store/reducers/auto-update-settings';

@Component({
    selector: 'auto-update-settings',
    templateUrl: './auto-update-settings.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutoUpdateSettings {

    @Input() state: State;

    @Output() toggleCheckForUpdateOnStartUp = new EventEmitter<boolean>();
    @Output() checkForUpdate = new EventEmitter<boolean>();

    faSpinner = faSpinner;

    constructor() {
    }

    emitCheckForUpdateOnStartUp(value: boolean) {
        this.toggleCheckForUpdateOnStartUp.emit(value);
    }

    emitCheckForUpdate($event: MouseEvent) {
        this.checkForUpdate.emit($event.shiftKey);
    }
}
