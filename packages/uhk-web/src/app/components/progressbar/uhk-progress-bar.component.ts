import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { ProgressBar, UhkProgressBarState } from '../../models/uhk-progress-bar-state';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'uhk-progress-bar',
    templateUrl: './uhk-progress-bar.component.html',
    styleUrls: ['./uhk-progress-bar.component.scss']
})
export class UhkProgressBarComponent {
    @Input() state: UhkProgressBarState;

    getStyleWidth(progressBar: ProgressBar): string {
        const percent = progressBar.currentValue / (progressBar.maxValue - progressBar.minValue) * 100;

        return `${percent}%`;
    }
}
