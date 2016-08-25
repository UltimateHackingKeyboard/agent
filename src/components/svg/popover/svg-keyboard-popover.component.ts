import { Component, OnInit, Input} from '@angular/core';

import {Module} from '../../../../config-serializer/config-items/Module';
import {KeyAction} from '../../../../config-serializer/config-items/KeyAction';
import {SvgKeyboardComponent} from '../keyboard';
import {PopoverComponent} from '../../popover';

@Component({
    selector: 'svg-keyboard-popover',
    template: require('./svg-keyboard-popover.component.html'),
    styles: [require('./svg-keyboard-popover.component.scss')],
    directives: [SvgKeyboardComponent, PopoverComponent]
})
export class SvgKeyboardPopoverComponent implements OnInit {
    @Input() moduleConfig: Module[];

    private popoverEnabled: boolean;
    private keyEditConfig: { moduleId: number, keyId: number };
    private popoverInitKeyAction: KeyAction;

    constructor() {
        this.keyEditConfig = {
            moduleId: undefined,
            keyId: undefined
        };
    }

    ngOnInit() { }

    onKeyClick(moduleId: number, keyId: number): void {
        if (!this.popoverEnabled) {
            this.keyEditConfig = {
                moduleId,
                keyId
            };

            let keyActionToEdit: KeyAction = this.moduleConfig[moduleId].keyActions.elements[keyId];
            this.showPopover(keyActionToEdit);
        }
    }

    onRemap(keyAction: KeyAction): void {
        this.changeKeyAction(keyAction);
        this.hidePopover();
    }

    showPopover(keyAction?: KeyAction): void {
        this.popoverInitKeyAction = keyAction;
        this.popoverEnabled = true;
    }

    hidePopover(): void {
        this.popoverEnabled = false;
        this.popoverInitKeyAction = undefined;
    }

    changeKeyAction(keyAction: KeyAction): void {
        let moduleId = this.keyEditConfig.moduleId;
        let keyId = this.keyEditConfig.keyId;
        this.moduleConfig[moduleId].keyActions.elements[keyId] = keyAction;
    }

}
