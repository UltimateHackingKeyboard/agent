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

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import { Store } from '@ngrx/store';

import { ClientRect } from '../../../dom';

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

interface NameValuePair {
    name: string;
    value: string;
}

@Component({
    selector: 'svg-keyboard-wrap',
    templateUrl: './svg-keyboard-wrap.component.html',
    styleUrls: ['./svg-keyboard-wrap.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SvgKeyboardWrapComponent implements OnInit, OnChanges {
    @Input() keymap: Keymap;
    @Input() popoverEnabled: boolean = true;
    @Input() tooltipEnabled: boolean = false;
    @Input() halvesSplit: boolean;

    @ViewChild(PopoverComponent, { read: ElementRef }) popover: ElementRef;

    private popoverShown: boolean;
    private keyEditConfig: { moduleId: number, keyId: number };
    private selectedKey: { layerId: number, moduleId: number, keyId: number };
    private popoverInitKeyAction: KeyAction;
    private keybindAnimationEnabled: boolean;
    private currentLayer: number = 0;
    private tooltipData: {
        posTop: number,
        posLeft: number,
        content: Observable<NameValuePair[]>,
        show: boolean
    };
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
            content: Observable.of([]),
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
            if (keymapChanges.isFirstChange() ||
                keymapChanges.previousValue.abbreviation !== keymapChanges.currentValue.abbreviation) {
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
            this.selectedKey = { layerId: this.currentLayer, moduleId, keyId };
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

    onCapture(moduleId: number, keyId: number, captured: { code: number, left: boolean[], right: boolean[] }): void {
        const keystrokeAction: KeystrokeAction = new KeystrokeAction();
        const modifiers = captured.left.concat(captured.right).map(x => x ? 1 : 0);

        keystrokeAction.scancode = captured.code;
        keystrokeAction.modifierMask = 0;

        for (let i = 0; i < modifiers.length; ++i) {
            keystrokeAction.modifierMask |= modifiers[i] << this.mapper.modifierMapper(i);
        }

        this.store.dispatch(
            KeymapActions.saveKey(
                this.keymap,
                this.currentLayer,
                moduleId,
                keyId,
                keystrokeAction)
        );
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

        this.tooltipData = {
            posLeft: posLeft,
            posTop: posTop,
            content: this.getKeyActionContent(keyAction),
            show: true
        };
    }

    hideTooltip() {
        this.tooltipData.show = false;
    }

    hidePopover(): void {
        this.popoverShown = false;
        this.selectedKey = undefined;
    }

    selectLayer(index: number): void {
        this.currentLayer = index;
    }

    getSelectedLayer(): number {
        return this.currentLayer;
    }

    private getKeyActionContent(keyAction: KeyAction): Observable<NameValuePair[]> {
        if (keyAction instanceof KeystrokeAction) {
            const keystrokeAction: KeystrokeAction = keyAction;
            const content: NameValuePair[] = [];
            content.push({
                name: 'Action type',
                value: 'Keystroke'
            });

            if (keystrokeAction.hasScancode()) {
                let value: string = keystrokeAction.scancode.toString();
                const scanCodeTexts: string = (this.mapper.scanCodeToText(keystrokeAction.scancode, keystrokeAction.type) || [])
                    .join(', ');
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
            return Observable.of(content);
        } else if (keyAction instanceof MouseAction) {
            const mouseAction: MouseAction = keyAction;
            const content: NameValuePair[] =
                [
                    {
                        name: 'Action type',
                        value: 'Mouse'
                    },
                    {
                        name: 'Action',
                        value: camelCaseToSentence(MouseActionParam[mouseAction.mouseAction])
                    }
                ];
            return Observable.of(content);
        } else if (keyAction instanceof PlayMacroAction) {
            const playMacroAction: PlayMacroAction = keyAction;
            return this.store
                .select(appState => appState.userConfiguration.macros)
                .map(macroState => macroState.find(macro => {
                    return macro.id === playMacroAction.macroId;
                }).name)
                .map(macroName => {
                    const content: NameValuePair[] = [
                        {
                            name: 'Action type',
                            value: 'Play macro'
                        },
                        {
                            name: 'Macro name',
                            value: macroName
                        }
                    ];
                    return content;
                });
        } else if (keyAction instanceof SwitchKeymapAction) {
            const switchKeymapAction: SwitchKeymapAction = keyAction;
            return this.store
                .select(appState => appState.userConfiguration.keymaps)
                .map(keymaps => keymaps.find(keymap => keymap.abbreviation === switchKeymapAction.keymapAbbreviation).name)
                .map(keymapName => {
                    const content: NameValuePair[] = [
                        {
                            name: 'Action type',
                            value: 'Switch keymap'
                        },
                        {
                            name: 'Keymap',
                            value: keymapName
                        }
                    ];
                    return content;
                });
        } else if (keyAction instanceof SwitchLayerAction) {
            const switchLayerAction: SwitchLayerAction = keyAction;
            const content: NameValuePair[] =
                [
                    {
                        name: 'Action type',
                        value: 'Switch layer'
                    },
                    {
                        name: 'Layer',
                        value: capitalizeFirstLetter(LayerName[switchLayerAction.layer])
                    },
                    {
                        name: 'Toogle',
                        value: switchLayerAction.isLayerToggleable ? 'On' : 'Off'
                    }
                ];
            return Observable.of(content);
        }

        return Observable.of([]);
    }
}
