import {
    Component, Input, OnChanges, OnDestroy, OnInit, SimpleChange,
    animate, group, style, transition, trigger
} from '@angular/core';

import { Store } from '@ngrx/store';

import { Subscription } from 'rxjs/Subscription';

import {
    KeyAction,
    KeystrokeAction,
    LayerName,
    MouseAction,
    PlayMacroAction,
    SwitchKeymapAction,
    SwitchLayerAction
} from '../../../../config-serializer/config-items/key-action';
import { KeyModifiers } from '../../../../config-serializer/config-items/KeyModifiers';
import { Macro } from '../../../../config-serializer/config-items/Macro';

import { MapperService } from '../../../../services/mapper.service';

import { AppState } from '../../../../store/index';
import { getMacroEntities } from '../../../../store/reducers/macro';

enum LabelTypes {
    KeystrokeKey,
    MouseKey,
    OneLineText,
    TwoLineText,
    TextIcon,
    SingleIcon,
    SwitchKeymap,
    IconText
}

@Component({
    animations: [
        trigger('change', [
            transition('inactive => active', [
                style({ fill: '#fff' }),
                group([
                    animate('1s ease-out', style({
                        fill: '#333'
                    }))
                ])
            ])
        ])
    ],
    selector: 'g[svg-keyboard-key]',
    template: require('./svg-keyboard-key.component.html'),
    styles: [require('./svg-keyboard-key.component.scss')]
})
export class SvgKeyboardKeyComponent implements OnInit, OnChanges, OnDestroy {
    @Input() id: string;
    @Input() rx: string;
    @Input() ry: string;
    @Input() height: number;
    @Input() width: number;
    @Input() keyAction: KeyAction;

    enumLabelTypes = LabelTypes;

    private labelSource: any;
    private labelType: LabelTypes;
    private macros: Macro[];
    private subscription: Subscription;
    private animation: string = 'inactive';

    constructor(private mapper: MapperService, private store: Store<AppState>) {
        this.subscription = store.let(getMacroEntities())
            .subscribe((macros: Macro[]) => this.macros = macros);
    }

    ngOnInit() {
        this.setLabels();
    }

    ngOnChanges(changes: { [propertyName: string]: SimpleChange }) {
        /* tslint:disable:no-string-literal */
        if (changes['keyAction']) {
            this.setLabels();
            this.animation = 'active';
        }
        /* tslint:enable:no-string-literal */
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    animationDone() {
        this.animation = 'inactive';
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

            if (!keyAction.hasActiveModifier() && keyAction.hasScancode()) {
                let scancode: number = keyAction.scancode;
                newLabelSource = this.mapper.scanCodeToText(scancode);
                if (this.mapper.hasScancodeIcon(scancode)) {
                    this.labelSource = this.mapper.scanCodeToSvgImagePath(scancode);
                    this.labelType = LabelTypes.SingleIcon;
                } else if (newLabelSource !== undefined) {
                    if (newLabelSource.length === 1) {
                        this.labelSource = newLabelSource[0];
                        this.labelType = LabelTypes.OneLineText;
                    } else {
                        this.labelSource = newLabelSource;
                        this.labelType = LabelTypes.TwoLineText;
                    }
                }
            } else if (keyAction.hasOnlyOneActiveModifier() && !keyAction.hasScancode()) {
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
            } else {
                this.labelType = LabelTypes.KeystrokeKey;
                this.labelSource = this.keyAction;
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
                    icon: this.mapper.getIcon('toggle')
                };
            } else {
                this.labelType = LabelTypes.OneLineText;
                this.labelSource = newLabelSource;
            }
        } else if (this.keyAction instanceof SwitchKeymapAction) {
            let keyAction: SwitchKeymapAction = this.keyAction as SwitchKeymapAction;
            this.labelType = LabelTypes.SwitchKeymap;
            this.labelSource = keyAction.keymapAbbreviation;
        } else if (this.keyAction instanceof PlayMacroAction) {
            let keyAction: PlayMacroAction = this.keyAction as PlayMacroAction;
            let macro: Macro = this.macros.find((macro: Macro) => macro.id === keyAction.macroId);
            this.labelType = LabelTypes.IconText;
            this.labelSource = {
                icon: this.mapper.getIcon('macro'),
                text: macro.name
            };
        } else if (this.keyAction instanceof MouseAction) {
            this.labelType = LabelTypes.MouseKey;
            this.labelSource = this.keyAction;
        } else {
            this.labelSource = undefined;
        }
    }
}
