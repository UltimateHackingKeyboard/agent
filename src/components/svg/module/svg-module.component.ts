import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { SvgKeyboardKey, SvgKeyboardKeyComponent } from '../keys';
import {KeyAction} from '../../../../config-serializer/config-items/KeyAction';

@Component({
    selector: 'g[svg-module]',
    template: require('./svg-module.component.html'),
    styles: [require('./svg-module.component.scss')],
    directives: [SvgKeyboardKeyComponent]
})
export class SvgModuleComponent implements OnInit {
    @Input() coverages: any[];
    @Input() keyboardKeys: SvgKeyboardKey[];
    @Input() keyActions: KeyAction[];
    @Output() editKeyActionRequest = new EventEmitter<number>();

    constructor() {
        this.keyboardKeys = [];
    }

    ngOnInit() { }

    onKeyClick(index: number): void {
        this.editKeyActionRequest.emit(index);
    }

}
