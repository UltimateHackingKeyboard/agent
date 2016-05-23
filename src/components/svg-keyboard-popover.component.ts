import { Component, OnInit, Input} from '@angular/core';

import {Module} from '../../config-serializer/config-items/Module';
import {KeyAction} from '../../config-serializer/config-items/KeyAction';
import {SvgKeyboardComponent} from './svg-keyboard.component';
import {PopoverComponent} from './popover/popover.component';

@Component({
    selector: 'svg-keyboard-popover',
    template:
    `
        <svg-keyboard [moduleConfig]="moduleConfig"
                    (keyClick)="onKeyClick($event.moduleId, $event.keyId)">
        </svg-keyboard>
        <popover *ngIf="popoverEnabled" (cancel)="hidePopover()" (remap)="onRemap($event)"></popover>
    `,
    styles:
    [`
        :host {
            display: flex;
            width: 100%;
            height: 100%;
            position: relative;
        }
    `],
    directives: [SvgKeyboardComponent, PopoverComponent]
})
export class SvgKeyboardPopoverComponent implements OnInit {
    @Input() moduleConfig: Module[];

    private popoverEnabled: boolean;
    private keyEditConfig: { moduleId: number, keyId: number };

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
            this.showPopover();
        }
    }

    onRemap(keyAction: KeyAction): void {
        this.changeKeyAction(keyAction);
        this.hidePopover();
    }

    showPopover(): void {
        this.popoverEnabled = true;
    }

    hidePopover(): void {
        this.popoverEnabled = false;
    }

    changeKeyAction(keyAction: KeyAction): void {
        let moduleId = this.keyEditConfig.moduleId;
        let keyId = this.keyEditConfig.keyId;
        this.moduleConfig[moduleId].keyActions.elements[keyId] = keyAction;
    }

}
