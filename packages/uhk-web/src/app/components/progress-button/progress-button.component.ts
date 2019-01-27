import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Action } from '@ngrx/store';

import { ProgressButtonState, initProgressButtonState } from '../../store/reducers/progress-button-state';

@Component({
    selector: 'progress-button',
    templateUrl: './progress-button.component.html',
    styleUrls: ['./progress-button.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProgressButtonComponent {
    @Input() state: ProgressButtonState = initProgressButtonState;
    @Output() clicked: EventEmitter<Action> = new EventEmitter<Action>();

    onClicked() {
        this.clicked.emit(this.state.action);
    }
}
