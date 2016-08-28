import {
    Component, 
    OnInit, 
    Input, 
    Output, 
    EventEmitter, 
    ElementRef, 
    ViewChild, 
    Renderer
} from '@angular/core';
import { Ng2SliderComponent } from 'ng2-slider-component/ng2-slider.component';
import { DelayMacroAction } from '../../../../../../config-serializer/config-items/DelayMacroAction'

const INITIAL_DELAY = 0.5; // 0.5 seconds

@Component({
    moduleId: module.id,
    selector: 'macro-delay-tab',
    template: require('./macro-delay.component.html'),
    styles: [
        require('./macro-delay.component.scss')
    ],
    host: { 'class': 'macro__delay' },
    directives: [
        Ng2SliderComponent
    ]
})
export class MacroDelayTabComponent implements OnInit {
    @Input() macroAction: DelayMacroAction;
    private delay: number;

    constructor(private renderer: Renderer) {}

    ngOnInit() {
       this.delay = this.macroAction.delay > 0 ? this.macroAction.delay / 1000 : INITIAL_DELAY;
    }

    setDelay(event:any) {
        this.delay = event.startValue;
        this.macroAction.delay = this.delay * 1000;
    }
}