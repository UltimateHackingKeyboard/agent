import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    Renderer,
    HostBinding,
    HostListener,
    Input,
    OnChanges,
    OnInit,
    ViewChild,
    SimpleChanges
} from '@angular/core';

import { Store } from '@ngrx/store';

import { MapperService } from '../../../services/mapper.service';

import {
    KeyAction,
    KeystrokeAction,
    LayerName,
    MouseAction,
    MouseActionParam,
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
import { PopoverComponent } from '../../popover';

@Component({
    selector: 'svg-keyboard-wrap',
    template: require('./svg-keyboard-wrap.component.html'),
    styles: [require('./svg-keyboard-wrap.component.scss')],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SvgKeyboardWrapComponent implements OnInit, OnChanges {
    @Input() keymap: Keymap;
    @Input() popoverEnabled: boolean = true;
    @Input() tooltipEnabled: boolean = false;

    @ViewChild(PopoverComponent, { read: ElementRef}) popover: ElementRef;

    private popoverShown: boolean;
    private keyEditConfig: { moduleId: number, keyId: number };
    private popoverInitKeyAction: KeyAction;
    private keybindAnimationEnabled: boolean;
    private currentLayer: number = 0;
    private tooltipData: { posTop: number, posLeft: number, content: { name: string, value: string }[], show: boolean };
    private layers: Layer[];
    private keyPosition: ClientRect;
    private wrapPosition: ClientRect;
    private wrapHost: HTMLElement;
    private keyElement: HTMLElement;

    @HostBinding('class.space') get space() {
        return this.popoverEnabled;
    }

    @HostListener('window:resize')
    onResize() {
        if (this.wrapHost) {
            this.wrapPosition = this.wrapHost.getBoundingClientRect();
        }

        if (this.keyElement) {
            this.keyPosition = this.keyElement.getBoundingClientRect();
        }
    }

    constructor(
        private store: Store<AppState>,
        private mapper: MapperService,
        private element: ElementRef,
        private renderer: Renderer
    ) {
        this.keyEditConfig = {
            moduleId: undefined,
            keyId: undefined
        };

        this.tooltipData = {
            posTop: 0,
            posLeft: 0,
            content: [],
            show: false
        };
    }

    ngOnInit() {
        this.wrapHost = this.element.nativeElement;
        this.wrapPosition = this.wrapHost.getBoundingClientRect();
    }

    ngOnChanges(changes: SimpleChanges) {
        const keymapChanges = changes['keymap'];
        if (keymapChanges) {
            this.popoverShown = false;
            this.layers = this.keymap.layers;
            if (keymapChanges.previousValue.abbreviation !== keymapChanges.currentValue.abbreviation) {
                this.currentLayer = 0;
                this.keybindAnimationEnabled = keymapChanges.isFirstChange();
            } else {
                this.keybindAnimationEnabled = true;
            }
        }

    }

    onKeyClick(moduleId: number, keyId: number, keyTarget: HTMLElement): void {
        if (!this.popoverShown && this.popoverEnabled) {
            this.keyEditConfig = {
                moduleId,
                keyId
            };

            const keyActionToEdit: KeyAction = this.layers[this.currentLayer].modules[moduleId].keyActions[keyId];
            this.keyElement = keyTarget;
            this.showPopover(keyActionToEdit);
        }
    }

    onKeyHover(moduleId: number, event: MouseEvent, over: boolean, keyId: number): void {
        if (this.tooltipEnabled) {
            const keyActionToEdit: KeyAction = this.layers[this.currentLayer].modules[moduleId].keyActions[keyId];

            if (over) {
                this.showTooltip(keyActionToEdit, event);
            } else {
                this.hideTooltip();
            }
        }
    }

    onRemap(keyAction: KeyAction): void {
        this.store.dispatch(
            KeymapActions.saveKey(
                this.keymap,
                this.currentLayer,
                this.keyEditConfig.moduleId,
                this.keyEditConfig.keyId,
                keyAction)
        );
        this.hidePopover();
    }

    showPopover(keyAction: KeyAction): void {
        this.keyPosition = this.keyElement.getBoundingClientRect();
        this.popoverInitKeyAction = keyAction;
        this.popoverShown = true;
        this.renderer.invokeElementMethod(this.popover.nativeElement, 'focus');
    }

    showTooltip(keyAction: KeyAction, event: MouseEvent): void {
        if (keyAction === undefined) {
            return;
        }

        const el: Element = event.target as Element || event.srcElement;
        const position: ClientRect = el.getBoundingClientRect();
        let posLeft: number = this.tooltipData.posLeft;
        let posTop: number = this.tooltipData.posTop;

        if (el.tagName === 'g') {
            posLeft = position.left + (position.width / 2);
            posTop = position.top + position.height;
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
                name: 'Macro name',
                value: playMacroAction.macro.name.toString()
            });

        } else if (keyAction instanceof SwitchKeymapAction) {
            const switchKeymapAction: SwitchKeymapAction = keyAction;
            content.push({
                name: 'Action type',
                value: 'Switch keymap'
            });
            content.push({
                name: 'Keymap',
                value: switchKeymapAction.keymap.name
            });
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
            show: true
        };
    }

    hideTooltip() {
        this.tooltipData.show = false;
    }

    hidePopover(): void {
        this.popoverShown = false;
    }

    selectLayer(index: number): void {
        this.currentLayer = index;
    }

}
