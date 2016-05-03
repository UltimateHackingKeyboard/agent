import { Component, OnInit, Input, OnChanges, SimpleChange } from '@angular/core';

import {KeyAction} from '../../config-serializer/config-items/KeyAction';
import {KeystrokeAction} from '../../config-serializer/config-items/KeystrokeAction';
import {KeystrokeModifiersAction, KeyModifiers} from '../../config-serializer/config-items/KeystrokeModifiersAction';
import {SwitchLayerAction, LayerName}  from '../../config-serializer/config-items/SwitchLayerAction';
import {MapperService} from '../services/mapper.service';

enum LabelTypes {
    Text,
    Path
}

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
            *ngIf="(labelType === enumLabelTypes.Text) && labelSource && labelSource.length > 0">
                 <tspan
                    *ngIf="labelSource.length === 1"
                    [attr.x]="width / 2"
                    dy="0"
                    >{{ labelSource[0] }}</tspan>
                <tspan
                    *ngIf="labelSource.length === 2"
                    *ngFor="let label of labelSource; let index = index"
                    [attr.x]="width / 2"
                    [attr.y]="(0.75 - index * 0.5) * height"
                    dy="0"
                    >{{ label }}</tspan>
         </svg:text>
         <svg:use [attr.xlink:href]="labelSource"
                [attr.width]="width / 3" [attr.height]="height / 3"
                [attr.x]="width / 3" [attr.y]="height / 3"
                fill="white"
                *ngIf="(labelType === enumLabelTypes.Path) && labelSource">
         </svg:use>
     `
})
export class SvgKeyboardKeyComponent implements OnInit, OnChanges {
    @Input() id: string;
    @Input() rx: string;
    @Input() ry: string;
    @Input() height: string;
    @Input() width: string;
    @Input() keyAction: KeyAction;

    /* tslint:disable:no-unused-variable */
    /* It is used in the template */
    private enumLabelTypes = LabelTypes;
    /* tslint:enable:no-unused-variable */

    private labelSource: any;
    private labelType: LabelTypes;

    constructor(private mapperService: MapperService) { }

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

        this.labelType = LabelTypes.Text;

        if (this.keyAction instanceof KeystrokeModifiersAction) {
            let keyAction: KeystrokeModifiersAction = this.keyAction as KeystrokeModifiersAction;
            let newLabelSource: string[] = [];
            if (keyAction.isOnlyOneModifierActive()) {
                switch (keyAction.modifierMask) {
                    case KeyModifiers.leftCtrl:
                    case KeyModifiers.rightCtrl:
                        newLabelSource.push('Ctrl');
                        break;
                    case KeyModifiers.leftShift:
                    case KeyModifiers.rightShift:
                        newLabelSource.push('Shift');
                        break;
                    case KeyModifiers.leftAlt:
                    case KeyModifiers.rightAlt:
                        newLabelSource.push('Alt');
                        break;
                    case KeyModifiers.leftGui:
                    case KeyModifiers.rightGui:
                        newLabelSource.push('Super');
                        break;
                    default:
                        newLabelSource.push('Undefined');
                        break;
                }
            }
            this.labelSource = newLabelSource;
        } else if (this.keyAction instanceof KeystrokeAction) {
            let scancode: number = (this.keyAction as KeystrokeAction).scancode;
            let newLabelSource: string[] = this.mapperService.scanCodeToText(scancode);
            if (newLabelSource) {
                this.labelSource = newLabelSource;
            } else {
                this.labelSource = this.mapperService.scanCodeToSvgImagePath(scancode);
                this.labelType = LabelTypes.Path;
            }
        } else if (this.keyAction instanceof SwitchLayerAction) {
            let keyAction: SwitchLayerAction = this.keyAction as SwitchLayerAction;
            let newLabelSource: string[] = [];
            switch (keyAction.layer) {
                case LayerName.mod:
                    newLabelSource.push('Mod');
                    break;
                case LayerName.fn:
                    newLabelSource.push('Fn');
                    break;
                case LayerName.mouse:
                    newLabelSource.push('Mouse');
                    break;
                default:
                    break;
            }
            this.labelSource = newLabelSource;
        }

    }

}
