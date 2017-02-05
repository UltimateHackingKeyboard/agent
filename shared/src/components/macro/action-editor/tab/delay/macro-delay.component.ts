import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    Input,
    OnInit,
    ViewChild
} from '@angular/core';

import { EditableMacroAction } from '../../../../../config-serializer/config-items/macro-action';

const INITIAL_DELAY = 0.5; // In seconds

@Component({
    selector: 'macro-delay-tab',
    templateUrl: './macro-delay.component.html',
    styleUrls: ['./macro-delay.component.scss'],
    host: { 'class': 'macro__delay' },
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MacroDelayTabComponent implements OnInit {
    @Input() macroAction: EditableMacroAction;
    @ViewChild('macroDelayInput') input: ElementRef;

    private delay: number;
    /* tslint:disable:no-unused-variable: It is used in the template. */
    private presets: number[] = [0.3, 0.5, 0.8, 1, 2, 3, 4, 5];
    /* tslint:enable:no-unused-variable */

    constructor() { }

    ngOnInit() {
        this.delay = this.macroAction.delay > 0 ? this.macroAction.delay / 1000 : INITIAL_DELAY;
    }

    setDelay(value: number): void {
        this.delay = value;
        this.macroAction.delay = this.delay * 1000;
    }
}
