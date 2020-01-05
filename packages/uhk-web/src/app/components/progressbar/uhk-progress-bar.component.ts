import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { UhkProgressBarState } from '../../models/uhk-progress-bar-state';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'uhk-progress-bar',
    templateUrl: './uhk-progress-bar.component.html',
    styleUrls: ['./uhk-progress-bar.component.scss']
})
export class UhkProgressBarComponent {
    @Input() state: UhkProgressBarState;

    getStyleWidth(): string {
        const percent = this.state.currentValue / (this.state.maxValue - this.state.minValue) * 100;

        return `${percent}%`;
    }
}
