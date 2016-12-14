import { Component, EventEmitter, Input, Output } from '@angular/core';

import { KeyAction } from '../../../config-serializer/config-items/key-action';

import { SvgKeyboardKey } from '../keys';

@Component({
    selector: 'g[svg-module]',
    template: require('./svg-module.component.html'),
    styles: [require('./svg-module.component.scss')]
})
export class SvgModuleComponent {
    @Input() coverages: any[];
    @Input() keyboardKeys: SvgKeyboardKey[];
    @Input() keyActions: KeyAction[];
    @Input() keybindAnimationEnabled: boolean;
    @Output() keyClick = new EventEmitter();
    @Output() keyHover = new EventEmitter();

    constructor() {
        this.keyboardKeys = [];
    }

    onKeyClick(index: number, keyTarget: HTMLElement): void {
        this.keyClick.emit({
            index,
            keyTarget
        });
    }

    onKeyHover(index: number, event: MouseEvent, over: boolean): void {
        this.keyHover.emit({
            index,
            event,
            over
        });
    }

}
