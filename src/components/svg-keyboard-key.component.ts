import { Component, OnInit, Input, OnChanges, SimpleChange } from 'angular2/core';

import {KeyAction} from '../../config-serializer/config-items/KeyAction';
import {KeystrokeAction} from '../../config-serializer/config-items/KeystrokeAction';
import {KeystrokeModifiersAction, KeyModifiers} from '../../config-serializer/config-items/KeystrokeModifiersAction';
import {SwitchLayerAction, LayerName}  from '../../config-serializer/config-items/SwitchLayerAction';
import {Mapper} from '../utils/mapper';

@Component({
    selector: 'g[svg-keyboard-key]',
    template:
    `
        <svg:rect [id]="id" [attr.rx]="rx"          [attr.ry]="ry"
                            [attr.height]="height"  [attr.width]="width"
                            [attr.fill]="fill"
        />
         <svg:text
            [attr.x]="0"
            [attr.y]="height/2"
            [attr.text-anchor]="'middle'"
            [attr.font-size]="19"
            [attr.font-family]="'Helvetica'"
            [attr.fill]="'#ffffff'"
            [attr.style]="'dominant-baseline: central'"
            *ngIf="labels && labels.length > 0">
                 <tspan
                    *ngIf="labels.length === 1"
                    [attr.x]="width / 2"
                    dy="0"
                    >{{ labels[0] }}</tspan>
                <tspan
                    *ngIf="labels.length === 2"
                    *ngFor="let label of labels; let index = index"
                    [attr.x]="width / 2"
                    [attr.y]="(0.75 - index * 0.5) * height"
                    dy="0"
                    >{{ label }}</tspan>
         </svg:text>
     `
})
export class SvgKeyboardKeyComponent implements OnInit, OnChanges {
    @Input() id: string;
    @Input() rx: string;
    @Input() ry: string;
    @Input() height: string;
    @Input() width: string;
    @Input() keyAction: KeyAction;

    private labels: any[];

    constructor() { }

    ngOnInit() {
        this.setLabels();
    }

    ngOnChanges(changes: { [propertyName: string]: SimpleChange }) {
        /* tslint:disable:no-string-literal */
        if (changes['keyAction']) {
            this.setLabels();
        }
        /* tslint:enable:no-string-literal */

    }

    private setLabels(): void {
        if (!this.keyAction) {
            return;
        }
        let newLabels: string[] = [];
        if (this.keyAction instanceof KeystrokeModifiersAction) {
            let keyAction: KeystrokeModifiersAction = <KeystrokeModifiersAction> this.keyAction;
            if (keyAction.isOnlyOneModifierActive()) {
                switch (keyAction.modifierMask) {
                    case KeyModifiers.leftCtrl:
                    case KeyModifiers.rightCtrl:
                        newLabels.push('Ctrl');
                        break;
                    case KeyModifiers.leftShift:
                    case KeyModifiers.rightShift:
                        newLabels.push('Shift');
                        break;
                    case KeyModifiers.leftAlt:
                    case KeyModifiers.rightAlt:
                        newLabels.push('Alt');
                        break;
                    case KeyModifiers.leftGui:
                    case KeyModifiers.rightGui:
                        newLabels.push('Super');
                        break;
                    default:
                        newLabels.push('Undefined');
                        break;
                }
            }
        } else if (this.keyAction instanceof KeystrokeAction) {
            let keyAction: KeystrokeAction = <KeystrokeAction> this.keyAction;
            newLabels = Mapper.scanCodeToText((keyAction as KeystrokeAction).scancode);
        } else if (this.keyAction instanceof SwitchLayerAction) {
            let keyAction: SwitchLayerAction = <SwitchLayerAction> this.keyAction;
            switch (keyAction.layer) {
                case LayerName.mod:
                    newLabels.push('Mod');
                    break;
                case LayerName.fn:
                    newLabels.push('Fn');
                    break;
                case LayerName.mouse:
                    newLabels.push('Mouse');
                    break;
                default:
                    break;
            }
        }
        this.labels = newLabels;
    }

}
