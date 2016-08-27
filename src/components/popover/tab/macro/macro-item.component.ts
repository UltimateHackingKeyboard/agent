import { Component, OnInit, OnChanges, Input } from '@angular/core';

import {MacroAction} from '../../../../config-serializer/config-items/MacroAction';
import {DelayMacroAction} from '../../../../config-serializer/config-items/DelayMacroAction';
import {HoldModifiersMacroAction} from '../../../../config-serializer/config-items/HoldModifiersMacroAction';
import {MoveMouseMacroAction} from '../../../../config-serializer/config-items/MoveMouseMacroAction';
import {PressModifiersMacroAction} from '../../../../config-serializer/config-items/PressModifiersMacroAction';
import {ReleaseModifiersMacroAction} from '../../../../config-serializer/config-items/ReleaseModifiersMacroAction';
import {ScrollMouseMacroAction} from '../../../../config-serializer/config-items/ScrollMouseMacroAction';
import {TextMacroAction} from '../../../../config-serializer/config-items/TextMacroAction';

import {IconComponent} from '../../widgets/icon';

import {KeyModifiers}  from '../../../../config-serializer/config-items/KeyModifiers';

@Component({
    moduleId: module.id,
    selector: 'macro-item',
    template: require('./macro-item.component.html'),
    styles: [require('./macro-item.component.scss')],
    directives: [IconComponent]
})
export class MacroItemComponent implements OnInit, OnChanges {

    @Input() macroAction: MacroAction;
    @Input() editable: boolean;
    @Input() deletable: boolean;
    @Input() moveable: boolean;

    private iconName: string;
    private title: string;

    constructor() { }

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
        } else if (this.macroAction instanceof PressModifiersMacroAction) {
            this.iconName = 'square';
            let action: PressModifiersMacroAction = this.macroAction as PressModifiersMacroAction;
            if (action.modifierMask === 0) {
                this.title = 'Invalid PressModifiersMacroAction!';
                return;
            }
            this.title = 'Press: ';
            for (let i = KeyModifiers.leftCtrl; i !== KeyModifiers.rightCtrl; i <<= 1) {
                if (action.isModifierActive(i)) {
                    this.title += ' ' + KeyModifiers[i];
                }
            }
        } else if (this.macroAction instanceof HoldModifiersMacroAction) {
            this.iconName = 'square';
            let action: HoldModifiersMacroAction = this.macroAction as HoldModifiersMacroAction;
            if (action.modifierMask === 0) {
                this.title = 'Invalid HoldModifiersMacroAction!';
                return;
            }
            this.title = 'Hold: ';
            for (let i = KeyModifiers.leftCtrl; i !== KeyModifiers.rightCtrl; i <<= 1) {
                if (action.isModifierActive(i)) {
                    this.title += ' ' + KeyModifiers[i];
                }
            }
        } else if (this.macroAction instanceof ReleaseModifiersMacroAction) {
            this.iconName = 'square';
            let action: ReleaseModifiersMacroAction = this.macroAction as ReleaseModifiersMacroAction;
            if (action.modifierMask === 0) {
                this.title = 'Invalid ReleaseModifiersMacroAction!';
                return;
            }
            this.title = 'Release: ';
            for (let i = KeyModifiers.leftCtrl; i !== KeyModifiers.rightCtrl; i <<= 1) {
                if (action.isModifierActive(i)) {
                    this.title += ' ' + KeyModifiers[i];
                }
            }
        }
        // TODO: finish for all MacroAction
    }

}
