import { Component, OnInit, Input } from '@angular/core';
import { DelayMacroAction } from '../../../../../../config-serializer/config-items/DelayMacroAction'

const INITIAL_DELAY = 0.5; // 0.5 seconds

@Component({
    moduleId: module.id,
    selector: 'macro-delay-tab',
    template: require('./macro-delay.component.html'),
    styles: [
        require('./macro-delay.component.scss')
    ],
    host: { 'class': 'macro__delay' }
})
export class MacroDelayTabComponent implements OnInit {
    @Input() macroAction: DelayMacroAction;
    private delay: number;
    private presets: number[] = [0.3, 0.5, 0.8, 1, 2, 3, 4, 5];

    constructor() {}

    ngOnInit() {
       this.delay = this.macroAction.delay > 0 ? this.macroAction.delay / 1000 : INITIAL_DELAY;
    }

    setDelay(value: any) {
        this.delay = value;
        this.macroAction.delay = this.delay * 1000;
    }
}