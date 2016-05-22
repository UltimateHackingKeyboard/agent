import { Component, OnInit, Input, OnChanges, SimpleChange } from '@angular/core';
import {NgSwitch, NgSwitchWhen} from '@angular/common';

import {KeyAction} from '../../../config-serializer/config-items/KeyAction';
import {KeystrokeAction} from '../../../config-serializer/config-items/KeystrokeAction';
import {KeystrokeModifiersAction, KeyModifiers} from '../../../config-serializer/config-items/KeystrokeModifiersAction';
import {SwitchLayerAction, LayerName}  from '../../../config-serializer/config-items/SwitchLayerAction';
import {MapperService} from '../../services/mapper.service';
import {SwitchKeymapAction} from '../../../config-serializer/config-items/SwitchKeymapAction';
import {UhkConfiguration} from '../../../config-serializer/config-items/UhkConfiguration';
import {UhkConfigurationService} from '../../services/uhk-configuration.service';

import {SvgOneLineTextKeyComponent} from './svg-one-line-text-key.component';
import {SvgTwoLineTextKeyComponent} from './svg-two-line-text-key.component';
import {SvgSingleIconKeyComponent} from './svg-single-icon-key.component';
import {SvgTextIconKeyComponent} from './svg-text-icon-key.component';
import {SvgSwitchKeymapKeyComponent} from './svg-switch-keymap-key.component';

enum LabelTypes {
    OneLineText,
    TwoLineText,
    TextIcon,
    SingleIcon,
    SwitchKeymap
}

@Component({
    selector: 'g[svg-keyboard-key]',
    template:
    `
        <svg:rect [id]="id" [attr.rx]="rx"          [attr.ry]="ry"
                            [attr.height]="height"  [attr.width]="width"
                            [attr.fill]="fill"
        />
        <svg:g [ngSwitch]="labelType"
                [attr.font-size]="19"
                [attr.font-family]="'Helvetica'"
                [attr.fill]="'white'"
                style="dominant-baseline: central">
            <svg:g svg-one-line-text-key *ngSwitchWhen="enumLabelTypes.OneLineText"
                    [height]="height"
                    [width]="width"
                    [text]="labelSource">
            </svg:g>
            <svg:g svg-two-line-text-key *ngSwitchWhen="enumLabelTypes.TwoLineText"
                    [height]="height"
                    [width]="width"
                    [texts]="labelSource">
            </svg:g>
            <svg:g svg-text-icon-key *ngSwitchWhen="enumLabelTypes.TextIcon"
                    [height]="height"
                    [width]="width"
                    [text]="labelSource.text"
                    [icon]="labelSource.icon">
            </svg:g>
            <svg:g svg-single-icon-key *ngSwitchWhen="enumLabelTypes.SingleIcon"
                    [height]="height"
                    [width]="width"
                    [icon]="labelSource">
            </svg:g>
            <svg:g svg-switch-keymap-key *ngSwitchWhen="enumLabelTypes.SwitchKeymap"
                    [height]="height"
                    [width]="width"
                    [abbreviation]="labelSource">
            </svg:g>
        </svg:g>
     `,
    directives:
    [
        NgSwitch,
        NgSwitchWhen,
        SvgOneLineTextKeyComponent,
        SvgTwoLineTextKeyComponent,
        SvgSingleIconKeyComponent,
        SvgTextIconKeyComponent,
        SvgSwitchKeymapKeyComponent
    ]
})
export class SvgKeyboardKeyComponent implements OnInit, OnChanges {
    @Input() id: string;
    @Input() rx: string;
    @Input() ry: string;
    @Input() height: number;
    @Input() width: number;
    @Input() keyAction: KeyAction;

    /* tslint:disable:no-unused-variable */
    /* It is used in the template */
    private enumLabelTypes = LabelTypes;
    /* tslint:enable:no-unused-variable */

    private labelSource: any;
    private labelType: LabelTypes;

    constructor(private mapperService: MapperService, private uhkConfigurationService: UhkConfigurationService) { }

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
            this.labelSource = undefined;
            this.labelType = LabelTypes.OneLineText;
            return;
        }

        this.labelType = LabelTypes.OneLineText;

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
                if (newLabelSource.length === 1) {
                    this.labelSource = newLabelSource[0];
                    this.labelType = LabelTypes.OneLineText;
                } else {
                    this.labelSource = newLabelSource;
                    this.labelType = LabelTypes.TwoLineText;
                }
            } else {
                this.labelSource = this.mapperService.scanCodeToSvgImagePath(scancode);
                this.labelType = LabelTypes.SingleIcon;
            }
        } else if (this.keyAction instanceof SwitchLayerAction) {
            let keyAction: SwitchLayerAction = this.keyAction as SwitchLayerAction;
            let newLabelSource: string;
            switch (keyAction.layer) {
                case LayerName.mod:
                    newLabelSource = 'Mod';
                    break;
                case LayerName.fn:
                    newLabelSource = 'Fn';
                    break;
                case LayerName.mouse:
                    newLabelSource = 'Mouse';
                    break;
                default:
                    break;
            }

            if (keyAction.isLayerToggleable) {
                this.labelType = LabelTypes.TextIcon;
                this.labelSource = {
                    text: newLabelSource,
                    icon: this.mapperService.getIcon('toggle')
                };
            } else {
                this.labelType = LabelTypes.OneLineText;
                this.labelSource = newLabelSource;
            }
        } else if (this.keyAction instanceof SwitchKeymapAction) {
            let keyAction: SwitchKeymapAction = this.keyAction as SwitchKeymapAction;
            this.labelType = LabelTypes.SwitchKeymap;
            let uhkConfiguration: UhkConfiguration = this.uhkConfigurationService.getUhkConfiguration();
            this.labelSource = uhkConfiguration.getKeymap(keyAction.keymapId).abbreviation;
        } else {
            this.labelSource = undefined;
        }

    }

}
