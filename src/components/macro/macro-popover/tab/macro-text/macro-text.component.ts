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
import { FORM_DIRECTIVES } from '@angular/forms';
import { TextMacroAction } from '../../../../../../config-serializer/config-items/TextMacroAction'

@Component({
    moduleId: module.id,
    selector: 'macro-text-tab',
    template: require('./macro-text.component.html'),
    styles: [require('./macro-text.component.scss')],
    host: { 'class': 'macro__text' },
    directives: [ FORM_DIRECTIVES ]
})
export class MacroTextTabComponent implements OnInit, AfterViewInit {
    @Input() macroAction: TextMacroAction;
    @ViewChild('macroTextInput') input: ElementRef;

    private text: string;

    constructor(private renderer: Renderer) {}

    ngOnInit() {
        console.log('faa', this.macroAction);
        this.text = this.macroAction.text;
    }

    ngAfterViewInit() {
        this.renderer.invokeElementMethod(this.input.nativeElement, 'focus');
    }

}