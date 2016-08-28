import {
    Component, 
    OnInit, 
    Input, 
    Output, 
    EventEmitter, 
    ElementRef, 
    ViewChild, 
    Renderer, 
    AfterViewInit
} from '@angular/core';
import { Ng2SliderComponent } from 'ng2-slider-component/ng2-slider.component';

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
export class MacroDelayTabComponent implements OnInit, AfterViewInit {
    private delay: number;

    constructor(private renderer: Renderer) {}

    ngOnInit() {
    }

    ngAfterViewInit() {
        
    }

    setDelay(event:any) {
        this.delay = event.startValue;
    }
}