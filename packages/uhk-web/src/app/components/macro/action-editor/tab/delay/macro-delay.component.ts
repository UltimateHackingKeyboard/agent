import { ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { DelayMacroAction } from 'uhk-common';

import { MacroBaseComponent } from '../macro-base.component';

const INITIAL_DELAY = 0.5; // In seconds

@Component({
    selector: 'macro-delay-tab',
    templateUrl: './macro-delay.component.html',
    styleUrls: ['./macro-delay.component.scss'],
    host: { class: 'macro__delay' },
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MacroDelayTabComponent extends MacroBaseComponent implements OnInit {
    @Input() macroAction: DelayMacroAction;
    @ViewChild('macroDelayInput') input: ElementRef;

    presets: number[] = [0.1, 0.5, 1, 5, 10];

    get delay(): number {
        return this._delay;
    }

    set delay(value: number) {
        this._delay = value;
        this.validate();
    }

    private _delay: number;

    constructor() {
        super();
    }

    ngOnInit() {
        if (!this.macroAction) {
            this.macroAction = new DelayMacroAction();
        }
        this.delay = this.macroAction.delay > 0 ? this.macroAction.delay / 1000 : INITIAL_DELAY;
    }

    setDelay(value: number): void {
        this._delay = value;
        this.macroAction.delay = this._delay * 1000;
        this.validate();
    }

    isMacroValid = () => this.macroAction.delay !== 0;
}
