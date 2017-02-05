import {
    AfterViewInit,
    Component,
    ElementRef,
    Input,
    Renderer,
    ViewChild
} from '@angular/core';

import { EditableMacroAction } from '../../../../../config-serializer/config-items/macro-action';

@Component({
    selector: 'macro-text-tab',
    templateUrl: './macro-text.component.html',
    styleUrls: ['./macro-text.component.scss'],
    host: { 'class': 'macro__text' }
})
export class MacroTextTabComponent implements AfterViewInit {
    @Input() macroAction: EditableMacroAction;
    @ViewChild('macroTextInput') input: ElementRef;

    constructor(private renderer: Renderer) {}

    ngAfterViewInit() {
        this.renderer.invokeElementMethod(this.input.nativeElement, 'focus');
    }

    onTextChange() {
        this.macroAction.text = this.input.nativeElement.value;
    }

}
