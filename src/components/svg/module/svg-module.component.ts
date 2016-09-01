import { Component, Input, Output, EventEmitter } from '@angular/core';

import { SvgKeyboardKey } from '../keys';
import {KeyAction} from '../../../config-serializer/config-items/KeyAction';

@Component({
    selector: 'g[svg-module]',
    template: require('./svg-module.component.html'),
    styles: [require('./svg-module.component.scss')]
})
export class SvgModuleComponent {
    @Input() coverages: any[];
    @Input() keyboardKeys: SvgKeyboardKey[];
    @Input() keyActions: KeyAction[];
    @Output() keyClick = new EventEmitter<number>();
    @Output() keyHover = new EventEmitter();

    constructor() {
        this.keyboardKeys = [];
    }

    onKeyClick(index: number): void {
        this.keyClick.emit(index);
    }

    onKeyHover(index: number, event: MouseEvent, over: boolean): void {
        this.keyHover.emit({
            index,
            event,
            over
        });
    }

}
