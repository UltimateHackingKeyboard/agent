import { Component, OnInit, Input, OnChanges, SimpleChange } from '@angular/core';
import {NgSwitch, NgSwitchCase} from '@angular/common';

import {KeyAction} from '../../../config-serializer/config-items/KeyAction';
import {KeystrokeAction} from '../../../config-serializer/config-items/KeystrokeAction';
import {KeyModifiers} from '../../../config-serializer/config-items/KeyModifiers';
import {PlayMacroAction} from '../../../config-serializer/config-items/PlayMacroAction';
import {SwitchLayerAction, LayerName}  from '../../../config-serializer/config-items/SwitchLayerAction';
import {MapperService} from '../../services/mapper.service';
import {SwitchKeymapAction} from '../../../config-serializer/config-items/SwitchKeymapAction';
import {UhkConfiguration} from '../../../config-serializer/config-items/UhkConfiguration';
import {UhkConfigurationService} from '../../services/uhk-configuration.service';

import {SvgOneLineTextKeyComponent} from './svg-one-line-text-key.component';
import {SvgTwoLineTextKeyComponent} from './svg-two-line-text-key.component';
import {SvgSingleIconKeyComponent} from './svg-single-icon-key.component';
import {SvgTextIconKeyComponent} from './svg-text-icon-key.component';
import {SvgIconTextKeyComponent} from './svg-icon-text-key.component';
import {SvgSwitchKeymapKeyComponent} from './svg-switch-keymap-key.component';

enum LabelTypes {
    OneLineText,
    TwoLineText,
    TextIcon,
    SingleIcon,
    SwitchKeymap,
    IconText
}

@Component({
    selector: 'g[svg-keyboard-key]',
    template: require('./svg-keyboard-key.component.html'),
    directives:
    [
        NgSwitch,
        NgSwitchCase,
        SvgOneLineTextKeyComponent,
        SvgTwoLineTextKeyComponent,
        SvgSingleIconKeyComponent,
        SvgTextIconKeyComponent,
        SvgIconTextKeyComponent,
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

        if (this.keyAction instanceof KeystrokeAction) {
            let keyAction: KeystrokeAction = this.keyAction as KeystrokeAction;
            let newLabelSource: string[];

            if (keyAction.hasScancode()) {
                let scancode: number = keyAction.scancode;
                newLabelSource = this.mapperService.scanCodeToText(scancode);
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
            } else if (keyAction.hasOnlyOneActiveModifier()) {
                newLabelSource = [];
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
                this.labelSource = newLabelSource;
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
        } else if (this.keyAction instanceof PlayMacroAction) {
            let keyAction: PlayMacroAction = this.keyAction as PlayMacroAction;
            this.labelType = LabelTypes.IconText;
            let uhkConfiguration: UhkConfiguration = this.uhkConfigurationService.getUhkConfiguration();
            this.labelSource = {
                icon: this.mapperService.getIcon('macro'),
                text: uhkConfiguration.getMacro(keyAction.macroId).name
            };
        } else {
            this.labelSource = undefined;
        }

    }

}
