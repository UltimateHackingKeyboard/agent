/// <reference path="../../../../config-serializer/Function.d.ts" />

import { Component, Input, OnChanges, OnInit } from '@angular/core';

import {KeyModifiers}  from '../../../../config-serializer/config-items/KeyModifiers';
import {
    DelayMacroAction,
    KeyMacroAction,
    MacroAction,
    MoveMouseMacroAction,
    ScrollMouseMacroAction,
    TextMacroAction
} from '../../../../config-serializer/config-items/macro-action';

import {MapperService} from '../../../../services/mapper.service';

@Component({
    selector: 'macro-item',
    template: require('./macro-item.component.html'),
    styles: [require('./macro-item.component.scss')]
})
export class MacroItemComponent implements OnInit, OnChanges {

    @Input() macroAction: MacroAction;
    @Input() editable: boolean;
    @Input() deletable: boolean;
    @Input() moveable: boolean;

    private iconName: string;
    private title: string;

    constructor(private mapper: MapperService) { }

    ngOnInit() {
        this.updateView();
    }

    ngOnChanges() {
        // TODO: check if macroAction changed
        this.updateView();
    }

    private updateView(): void {

        this.title = this.macroAction.constructor.name;
        if (this.macroAction instanceof MoveMouseMacroAction) {
            this.iconName = 'mouse-pointer';
            this.title = 'Move pointer';

            let action: MoveMouseMacroAction = this.macroAction as MoveMouseMacroAction;
            let needAnd: boolean;
            if (Math.abs(action.x) > 0) {
                this.title += ` by ${Math.abs(action.x)}px ${action.x > 0 ? 'left' : 'right'}ward`;
                needAnd = true;
            }
            if (Math.abs(action.y) > 0) {
                this.title += ` ${needAnd ? 'and' : 'by'} ${Math.abs(action.y)}px ${action.y > 0 ? 'down' : 'up'}ward`;
            }
        } else if (this.macroAction instanceof DelayMacroAction) {
            this.iconName = 'clock';
            let action: DelayMacroAction = this.macroAction as DelayMacroAction;
            this.title = `Delay of ${action.delay}ms`;
        } else if (this.macroAction instanceof TextMacroAction) {
            let action: TextMacroAction = this.macroAction as TextMacroAction;
            this.title = `Write text: ${action.text}`;
        } else if (this.macroAction instanceof ScrollMouseMacroAction) {
            this.iconName = 'mouse-pointer';
            this.title = 'Scroll';
            let action: ScrollMouseMacroAction = this.macroAction as ScrollMouseMacroAction;
            let needAnd: boolean;
            if (Math.abs(action.x) > 0) {
                this.title += ` by ${Math.abs(action.x)}px ${action.x > 0 ? 'left' : 'right'}ward`;
                needAnd = true;
            }
            if (Math.abs(action.y) > 0) {
                this.title += ` ${needAnd ? 'and' : 'by'} ${Math.abs(action.y)}px ${action.y > 0 ? 'down' : 'up'}ward`;
            }
        } else if (this.macroAction instanceof KeyMacroAction) {
            const keyMacroAction: KeyMacroAction = <KeyMacroAction>this.macroAction;
            this.title += 'KeyMacroAction: ';
            if (keyMacroAction.isPressAction()) {
                this.title = 'Press';
            } else if (keyMacroAction.isHoldAction()) {
                this.title = 'Hold';
            } else {
                this.title = 'Release';
            }
            if (keyMacroAction.hasScancode()) {
                this.title += ' ' + this.mapper.scanCodeToText(keyMacroAction.scancode).join(' ');
            }
            this.iconName = 'square';

            for (let i = KeyModifiers.leftCtrl; i !== KeyModifiers.rightCtrl; i <<= 1) {
                if (keyMacroAction.isModifierActive(i)) {
                    this.title += ' ' + KeyModifiers[i];
                }
            }
        }
        // TODO: finish for all MacroAction
    }

}
