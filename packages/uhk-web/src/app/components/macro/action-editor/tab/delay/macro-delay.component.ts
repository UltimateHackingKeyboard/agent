import {
    ChangeDetectionStrategy,
    Component,
    Input,
    OnInit
} from '@angular/core';
import { DelayMacroAction, UINT16_MAX } from 'uhk-common';

import { MacroBaseComponent } from '../macro-base.component';

const INITIAL_DELAY = 0.5; // In seconds
const MAX_DELAY_SECONDS = UINT16_MAX / 1000;

@Component({
    selector: 'macro-delay-tab',
    standalone: false,
    templateUrl: './macro-delay.component.html',
    styleUrls: ['./macro-delay.component.scss'],
    host: { 'class': 'macro__delay' },
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MacroDelayTabComponent extends MacroBaseComponent implements OnInit {
    @Input() macroAction: DelayMacroAction;

    maxDelaySeconds = MAX_DELAY_SECONDS;
    presets: number[] = [0.1, 0.5, 1, 5, 10];

    get delay(): number {
        return this._delay;
    }

    set delay(value: number) {
        this._delay = value;
        this.validate();
    }

    private _delay: number;

    constructor() { super(); }

    ngOnInit() {
        if (!this.macroAction) {
            this.macroAction = new DelayMacroAction();
        }
        this.delay = this.macroAction.delay > 0 ? this.macroAction.delay / 1000 : INITIAL_DELAY;
    }

    setDelay(value: number): void {
        if (Number.isNaN(value)) {
            return;
        }

        const delayMs = Math.min(Math.max(Math.round(value * 1000), 0), UINT16_MAX);
        this._delay = delayMs / 1000;
        this.macroAction.delay = delayMs;
        this.validate();
    }

    isMacroValid = () => this.macroAction.delay !== 0;

}
