import { Component, Input, Output, EventEmitter } from '@angular/core';

import { SvgKeyboardKey, SvgKeyboardKeyComponent } from '../keys';
import {KeyAction} from '../../../config-serializer/config-items/KeyAction';

@Component({
    selector: 'g[svg-module]',
    template: require('./svg-module.component.html'),
    styles: [require('./svg-module.component.scss')],
    directives: [SvgKeyboardKeyComponent]
})
export class SvgModuleComponent {
    @Input() coverages: any[];
    @Input() keyboardKeys: SvgKeyboardKey[];
    @Input() keyActions: KeyAction[];
    @Output() clickKeyActionRequest = new EventEmitter<number>();
    @Output() hoverKeyActionRequest = new EventEmitter();

    constructor() {
        this.keyboardKeys = [];
    }

    onKeyClick(index: number): void {
        this.clickKeyActionRequest.emit(index);
    }

    onKeyHover(index: number, event: MouseEvent, over: boolean): void {
        this.hoverKeyActionRequest.emit({
            index,
            event,
            over
        });
    }

}
