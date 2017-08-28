import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    Input,
    OnInit,
    ViewChild
} from '@angular/core';

import { DelayMacroAction } from '../../../../../config-serializer/config-items/macro-action';
import { MacroBaseComponent } from '../macro-base.component';

const INITIAL_DELAY = 0.5; // In seconds

@Component({
    selector: 'macro-delay-tab',
    templateUrl: './macro-delay.component.html',
    styleUrls: ['./macro-delay.component.scss'],
    host: { 'class': 'macro__delay' },
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MacroDelayTabComponent extends MacroBaseComponent implements OnInit {
    @Input() macroAction: DelayMacroAction;
    @ViewChild('macroDelayInput') input: ElementRef;

    delay: number;
    presets: number[] = [0.3, 0.5, 0.8, 1, 2, 3, 4, 5];

    constructor() { super(); }

    ngOnInit() {
        if (!this.macroAction) {
            this.macroAction = new DelayMacroAction();
        }
        this.delay = this.macroAction.delay > 0 ? this.macroAction.delay / 1000 : INITIAL_DELAY;
        this.validate(); // initial validation as it has defaults
    }

    setDelay(value: number): void {
        this.delay = value;
        this.macroAction.delay = this.delay * 1000;
        this.validate();
    }

    isMacroValid = () => this.macroAction.delay !== 0;

}
