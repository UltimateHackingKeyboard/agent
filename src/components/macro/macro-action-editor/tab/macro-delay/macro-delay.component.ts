import { Component, OnInit, Input, AfterViewInit, ViewChild, Renderer, ElementRef } from '@angular/core';
import { DelayMacroAction } from '../../../../../config-serializer/config-items/DelayMacroAction';

const INITIAL_DELAY = 0.5; // 0.5 seconds

@Component({
    selector: 'macro-delay-tab',
    template: require('./macro-delay.component.html'),
    styles: [
        require('./macro-delay.component.scss')
    ],
    host: { 'class': 'macro__delay' }
})
export class MacroDelayTabComponent implements OnInit, AfterViewInit {
    @Input() macroAction: DelayMacroAction;
    @ViewChild('macroDelayInput') input: ElementRef;
    private delay: number;
    /* tslint:disable:no-unused-variable: It is used in the template. */
    private presets: number[] = [0.3, 0.5, 0.8, 1, 2, 3, 4, 5];
    /* tslint:enable:no-unused-variable */

    constructor(private renderer: Renderer) {}

    ngOnInit() {
       this.delay = this.macroAction.delay > 0 ? this.macroAction.delay / 1000 : INITIAL_DELAY;
    }

    setDelay(value: number) {
        this.delay = value;
        this.macroAction.delay = this.delay * 1000;
    }

    ngAfterViewInit() {
        this.renderer.invokeElementMethod(this.input.nativeElement, 'focus');
    }
}
