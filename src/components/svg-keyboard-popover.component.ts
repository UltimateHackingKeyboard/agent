import { Component, OnInit, Input} from '@angular/core';

import {Module} from '../../config-serializer/config-items/Module';
import {SvgKeyboardComponent} from './svg-keyboard.component';
import {PopoverComponent} from './popover/popover.component';

@Component({
    selector: 'svg-keyboard-popover',
    template:
    `
        <svg-keyboard [moduleConfig]="moduleConfig"
                    (keyClick)="onKeyClick($event.moduleId, $event.keyId)">
        </svg-keyboard>
        <popover *ngIf="popoverEnabled" (cancel)="hidePopover()"></popover>
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

    constructor() { }

    ngOnInit() { }

    onKeyClick(moduleId: number, keyId: number): void {
        this.showPopover();
    }

    showPopover(): void {
        this.popoverEnabled = true;
    }

    hidePopover(): void {
        this.popoverEnabled = false;
    }

}
