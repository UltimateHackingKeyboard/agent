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

    constructor(private renderer: Renderer) {}

    ngOnInit() {
    }

    setDelay(event:any) {
        this.macroAction.delay = event.startValue;
    }
}