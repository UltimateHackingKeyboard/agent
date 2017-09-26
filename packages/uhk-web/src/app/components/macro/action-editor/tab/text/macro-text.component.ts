import {
    OnInit,
    AfterViewInit,
    Component,
    ElementRef,
    Input,
    Renderer,
    ViewChild
} from '@angular/core';
import { TextMacroAction } from 'uhk-common';

import { MacroBaseComponent } from '../macro-base.component';

@Component({
    selector: 'macro-text-tab',
    templateUrl: './macro-text.component.html',
    styleUrls: ['./macro-text.component.scss'],
    host: { 'class': 'macro__text' }
})
export class MacroTextTabComponent extends MacroBaseComponent implements OnInit, AfterViewInit {
    @Input() macroAction: TextMacroAction;
    @ViewChild('macroTextInput') input: ElementRef;

    constructor(private renderer: Renderer) { super(); }

    ngOnInit() {
        this.init();
    }

    ngAfterViewInit() {
        this.renderer.invokeElementMethod(this.input.nativeElement, 'focus');
    }

    onTextChange() {
        this.init();
        this.macroAction.text = this.input.nativeElement.value;
    }

    isMacroValid = () => !!this.input.nativeElement.value;

    private init = () => {
        if (!this.macroAction) {
            this.macroAction = new TextMacroAction();
        }
    }

}
