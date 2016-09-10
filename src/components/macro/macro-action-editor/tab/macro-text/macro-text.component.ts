import { EditableMacroAction } from '../../../../../config-serializer/config-items/macro-action/EditableMacroAction';
import {
    AfterViewInit,
    Component,
    ElementRef,
    Input,
    OnInit,
    Renderer,
    ViewChild
} from '@angular/core';

@Component({
    selector: 'macro-text-tab',
    template: require('./macro-text.component.html'),
    styles: [require('./macro-text.component.scss')],
    host: { 'class': 'macro__text' }
})
export class MacroTextTabComponent implements OnInit, AfterViewInit {
    @Input() macroAction: EditableMacroAction;
    @ViewChild('macroTextInput') input: ElementRef;

    constructor(private renderer: Renderer) {}

    ngOnInit() {}

    ngAfterViewInit() {
        this.renderer.invokeElementMethod(this.input.nativeElement, 'focus');
    }

}
