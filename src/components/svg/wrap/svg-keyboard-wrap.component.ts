import {
    Component,
    Input,
    OnChanges,
    SimpleChanges,
    animate,
    keyframes,
    state,
    style,
    transition,
    trigger
} from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/observable/from';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';

import { MapperService } from '../../../services/mapper.service';

import {
    KeyAction,
    KeystrokeAction,
    LayerName,
    MouseAction,
    MouseActionParam,
    NoneAction,
    PlayMacroAction,
    SwitchKeymapAction,
    SwitchLayerAction
} from '../../../config-serializer/config-items/key-action';
import { Keymap } from '../../../config-serializer/config-items/Keymap';
import { Layer } from '../../../config-serializer/config-items/Layer';
import { LongPressAction } from '../../../config-serializer/config-items/LongPressAction';
import { camelCaseToSentence, capitalizeFirstLetter } from '../../../util';

import { AppState } from '../../../store';
import { KeymapActions } from '../../../store/actions';

@Component({
    selector: 'svg-keyboard-wrap',
    template: require('./svg-keyboard-wrap.component.html'),
    styles: [require('./svg-keyboard-wrap.component.scss')],
    // We use 101%, because there was still a trace of the keyboard in the screen when animation was done
    animations: [
        trigger('layerState', [
            state('leftIn, rightIn', style({
                transform: 'translateX(-50%)',
                left: '50%'
            })),
            state('leftOut', style({
                transform: 'translateX(-101%)',
                left: '0'
            })),
            state('rightOut', style({
                transform: 'translateX(0)',
                left: '101%'
            })),
            transition('leftOut => leftIn, rightOut => leftIn', [
                animate('400ms ease-out', keyframes([
                    style({ transform: 'translateX(0%)', left: '101%', offset: 0 }),
                    style({ transform: 'translateX(-50%)', left: '50%', offset: 1 })
                ]))
            ]),
            transition('leftIn => leftOut, rightIn => leftOut', [
                animate('400ms ease-out', keyframes([
                    style({ transform: 'translateX(-50%)', left: '50%', offset: 0 }),
                    style({ transform: 'translateX(-101%)', left: '0%', offset: 1 })
                ]))
            ]),
            transition('* => rightIn', [
                animate('400ms ease-out', keyframes([
                    style({ transform: 'translateX(-101%)', left: '0%', offset: 0 }),
                    style({ transform: 'translateX(-50%)', left: '50%', offset: 1 })
                ]))
            ]),
            transition('* => rightOut', [
                animate('400ms ease-out', keyframes([
                    style({ transform: 'translateX(-50%)', left: '50%', offset: 0 }),
                    style({ transform: 'translateX(0%)', left: '101%', offset: 1 })
                ]))
            ])
        ])
    ]
})
export class SvgKeyboardWrapComponent implements OnChanges {
    @Input() keymap: Keymap;
    @Input() popoverEnabled: boolean = true;
    @Input() tooltipEnabled: boolean = false;

    private popoverShown: boolean;
    private keyEditConfig: { keyActions: KeyAction[], keyId: number };
    private popoverInitKeyAction: KeyAction;
    private currentLayer: number = 0;
    private tooltipData: { posTop: number, posLeft: number, content: { name: string, value: string }[], shown: boolean };
    private layers: Layer[];

    constructor(private store: Store<AppState>, private mapper: MapperService) {
        this.keyEditConfig = {
            keyActions: undefined,
            keyId: undefined
        };

        this.tooltipData = {
            posTop: 0,
            posLeft: 0,
            content: [],
            shown: false
        };
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['keymap'].previousValue.abbreviation !== changes['keymap'].currentValue.abbreviation) {
            this.layers = this.keymap.layers;
            this.currentLayer = 0;
            this.popoverShown = false;

            if (this.layers.length > 0) {
                this.layers.forEach(element => element.animation = 'leftOut');
                this.layers[0].animation = 'leftIn';
            }
        } else if (changes['keymap']) {
            this.popoverShown = false;
        }
    }

    onKeyClick(moduleId: number, keyId: number): void {
        if (!this.popoverShown && this.popoverEnabled) {
            this.keyEditConfig = {
                keyActions: this.layers[this.currentLayer].modules[moduleId].keyActions,
                keyId
            };

            let keyActionToEdit: KeyAction = this.keyEditConfig.keyActions[keyId];
            this.showPopover(keyActionToEdit);
        }
    }

    onKeyHover(moduleId: number, event: MouseEvent, over: boolean, keyId: number): void {
        let keyActionToEdit: KeyAction = this.layers[this.currentLayer].modules[moduleId].keyActions[keyId];

        if (this.tooltipEnabled) {
            if (over) {
                this.showTooltip(keyActionToEdit, event);
            } else {
                this.hideTooltip(event);
            }
        }
    }

    onRemap(keyAction: KeyAction): void {
        this.changeKeyAction(keyAction);
        this.store.dispatch(KeymapActions.saveKey(this.keymap));
        this.hidePopover();
    }

    showPopover(keyAction?: KeyAction): void {
        this.popoverInitKeyAction = keyAction;
        this.popoverShown = true;
    }

    showTooltip(keyAction: KeyAction, event: MouseEvent): void {

        if (keyAction instanceof NoneAction || keyAction === undefined) {
            return;
        }

        let el: Element = event.target as Element || event.srcElement;
        let position: ClientRect = el.getBoundingClientRect();
        let posLeft: number = this.tooltipData.posLeft;
        let posTop: number = this.tooltipData.posTop;

        if (el.tagName === 'rect') {
            posLeft = position.left + (position.width / 2);
            posTop = position.top;
        }

        let content: {
            name: string,
            value: string
        }[] = [];

        if (keyAction instanceof KeystrokeAction) {
            const keystrokeAction: KeystrokeAction = keyAction;
            content.push({
                name: 'Action type',
                value: 'Keystroke'
            });

            if (keystrokeAction.hasScancode()) {
                let value: string = keystrokeAction.scancode.toString();
                const scanCodeTexts: string = (this.mapper.scanCodeToText(keystrokeAction.scancode) || []).join(', ');
                if (scanCodeTexts.length > 0) {
                    value += ' (' + scanCodeTexts + ')';
                }
                content.push({
                    name: 'Scancode',
                    value
                });
            }

            if (keystrokeAction.hasActiveModifier()) {
                content.push({
                    name: 'Modifiers',
                    value: keystrokeAction.getModifierList().join(', ')
                });
            }

            if (keystrokeAction.hasLongPressAction()) {
                content.push({
                    name: 'Long press',
                    value: LongPressAction[keystrokeAction.longPressAction]
                });
            }
        } else if (keyAction instanceof MouseAction) {
            const mouseAction: MouseAction = keyAction;
            content.push({
                name: 'Action type',
                value: 'Mouse'
            });
            content.push({
                name: 'Action',
                value: camelCaseToSentence(MouseActionParam[mouseAction.mouseAction])
            });
        } else if (keyAction instanceof PlayMacroAction) {
            const playMacroAction: PlayMacroAction = keyAction;
            content.push({
                name: 'Action type',
                value: 'Play macro'
            });

            content.push({
                name: 'Macro id',
                value: playMacroAction.macroId.toString()
            });

            // Replace the macro id with the name
            this.store
                .select(appState => appState.macros)
                .first()
                .map(macroState => macroState.entities.filter(macro => {
                    return macro.id === playMacroAction.macroId;
                })[0].name)
                .subscribe(name => {
                    content[1] = {
                        name: 'Macro name',
                        value: name
                    };
                });
        } else if (keyAction instanceof SwitchKeymapAction) {
            const switchKeymapAction: SwitchKeymapAction = keyAction;
            content.push({
                name: 'Action type',
                value: 'Switch keymap'
            });
            content.push({
                name: 'Keymap',
                value: '...'
            });
            this.store
                .select(appState => appState.keymaps)
                .first()
                .switchMap<Keymap>(keymaps => Observable.from(keymaps.entities))
                .filter(keymap => keymap.abbreviation === switchKeymapAction.keymapAbbreviation)
                .subscribe(keymap => content[1].value = keymap.name);
        } else if (keyAction instanceof SwitchLayerAction) {
            const switchLayerAction: SwitchLayerAction = keyAction;
            content.push({
                name: 'Action type',
                value: 'Switch layer'
            });
            content.push({
                name: 'Layer',
                value: capitalizeFirstLetter(LayerName[switchLayerAction.layer])
            });
            content.push({
                name: 'Toogle',
                value: switchLayerAction.isLayerToggleable ? 'On' : 'Off'
            });
        }

        this.tooltipData = {
            posLeft: posLeft,
            posTop: posTop,
            content,
            shown: true
        };
    }

    hideTooltip(event: MouseEvent) {
        let target: HTMLElement = event.relatedTarget as HTMLElement;
        if (!target) {
            this.tooltipData.shown = false;
            return;
        }

        // Check if we are hovering tooltip
        let list: DOMTokenList = target.classList;
        if (!list.contains('tooltip') && !list.contains('tooltip-inner')) {
            this.tooltipData.shown = false;
        }
    }

    hidePopover(): void {
        this.popoverShown = false;
        this.popoverInitKeyAction = undefined;
    }

    changeKeyAction(keyAction: KeyAction): void {
        let keyId = this.keyEditConfig.keyId;
        this.keyEditConfig.keyActions[keyId] = keyAction;
    }

    selectLayer(oldIndex: number, index: number): void {
        if (index > oldIndex) {
            this.layers[oldIndex].animation = 'leftOut';
            this.layers[index].animation = 'leftIn';
        } else {
            this.layers[oldIndex].animation = 'rightOut';
            this.layers[index].animation = 'rightIn';
        }

        this.currentLayer = index;
    }
}
