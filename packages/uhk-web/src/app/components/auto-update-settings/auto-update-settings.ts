import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { State } from '../../store/reducers/auto-update-settings';

@Component({
    selector: 'auto-update-settings',
    templateUrl: './auto-update-settings.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutoUpdateSettings {
    @Input() version: string;
    @Input() settings: State | undefined;
    @Input() checkingForUpdate: boolean;

    @Output() toggleCheckForUpdateOnStartUp = new EventEmitter<boolean>();
    @Output() toggleUsePreReleaseUpdate = new EventEmitter<boolean>();
    @Output() checkForUpdate = new EventEmitter();

    constructor() {}

    emitCheckForUpdateOnStartUp(value: boolean) {
        this.toggleCheckForUpdateOnStartUp.emit(value);
    }

    emitUsePreReleaseUpdate(value: boolean) {
        this.toggleUsePreReleaseUpdate.emit(value);
    }

    emitCheckForUpdate() {
        this.checkForUpdate.emit();
    }
}
