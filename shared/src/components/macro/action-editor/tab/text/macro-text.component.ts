import {
    OnInit,
    AfterViewInit,
    Component,
    ElementRef,
    Input,
    Renderer,
    ViewChild
} from '@angular/core';

import { TextMacroAction } from '../../../../../config-serializer/config-items/macro-action';

@Component({
    selector: 'macro-text-tab',
    templateUrl: './macro-text.component.html',
    styleUrls: ['./macro-text.component.scss'],
    host: { 'class': 'macro__text' }
})
export class MacroTextTabComponent implements OnInit, AfterViewInit {
    @Input() macroAction: TextMacroAction;
    @ViewChild('macroTextInput') input: ElementRef;

    constructor(private renderer: Renderer) {}

    ngOnInit() {
        if (!this.macroAction) {
            this.macroAction = new TextMacroAction();
        }
    }

    ngAfterViewInit() {
        this.renderer.invokeElementMethod(this.input.nativeElement, 'focus');
    }

    onTextChange() {
        this.macroAction.text = this.input.nativeElement.value;
    }

}
