import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    EventEmitter,
    HostBinding,
    HostListener,
    Input,
    OnChanges,
    OnInit,
    Output,
    Renderer,
    SimpleChanges,
    ViewChild
} from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import { Store } from '@ngrx/store';

import {
    camelCaseToSentence,
    capitalizeFirstLetter,
    KeyAction,
    Keymap,
    KeystrokeAction,
    Layer,
    LayerName,
    MouseAction,
    MouseActionParam,
    PlayMacroAction,
    SecondaryRoleAction,
    SwitchKeymapAction,
    SwitchLayerAction,
    SwitchLayerMode
} from 'uhk-common';

import { MapperService } from '../../../services/mapper.service';
import { AppState } from '../../../store';
import { KeymapActions } from '../../../store/actions';
import { PopoverComponent } from '../../popover';
import { KeyboardLayout } from '../../../keyboard/keyboard-layout.enum';
import { ChangeKeymapDescription } from '../../../models/ChangeKeymapDescription';
import { KeyActionRemap } from '../../../models/key-action-remap';
import {
    SvgKeyboardCaptureEvent,
    SvgKeyboardKeyClickEvent,
    SvgKeyHoverEvent
} from '../../../models/svg-key-events';

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
    @Input() keyboardLayout: KeyboardLayout.ANSI;
    @Input() allowLayerDoubleTap: boolean;

    @Output() descriptionChanged = new EventEmitter<ChangeKeymapDescription>();

    @ViewChild(PopoverComponent, {read: ElementRef}) popover: ElementRef;

    popoverShown: boolean;
    keyEditConfig: { moduleId: number, keyId: number };
    selectedKey: { layerId: number, moduleId: number, keyId: number };
    popoverInitKeyAction: KeyAction;
    keybindAnimationEnabled: boolean;
    currentLayer: number = 0;
    tooltipData: {
        posTop: number,
        posLeft: number,
        content: Observable<NameValuePair[]>,
        show: boolean
    };
    layers: Layer[];
    keyPosition: ClientRect;
    wrapPosition: ClientRect;
    remapOnAllKeymap: boolean;
    remapOnAllLayer: boolean;

    private wrapHost: HTMLElement;
    private keyElement: HTMLElement;

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
                this.keybindAnimationEnabled = keymapChanges.isFirstChange();
            } else {
                this.keybindAnimationEnabled = true;
            }
        }

    }

    onKeyClick(event: SvgKeyboardKeyClickEvent): void {
        if (!this.popoverShown && this.popoverEnabled) {
            this.keyEditConfig = {
                moduleId: event.moduleId,
                keyId: event.keyId
            };
            this.selectedKey = {layerId: this.currentLayer, moduleId: event.moduleId, keyId: event.keyId};
            const keyActionToEdit: KeyAction = this.layers[this.currentLayer].modules[event.moduleId].keyActions[event.keyId];
            this.keyElement = event.keyTarget;
            this.remapOnAllKeymap = event.shiftPressed;
            this.remapOnAllLayer = event.altPressed;
            this.showPopover(keyActionToEdit);
        }
    }

    onKeyHover(event: SvgKeyHoverEvent): void {
        if (this.tooltipEnabled) {
            const keyActionToEdit: KeyAction = this.layers[this.currentLayer].modules[event.moduleId].keyActions[event.keyId];

            if (event.over) {
                this.showTooltip(keyActionToEdit, event.event);
            } else {
                this.hideTooltip();
            }
        }
    }

    onCapture(event: SvgKeyboardCaptureEvent): void {
        const keystrokeAction: KeystrokeAction = new KeystrokeAction();
        const modifiers = event.captured.left.concat(event.captured.right).map(x => x ? 1 : 0);

        keystrokeAction.scancode = event.captured.code;
        keystrokeAction.modifierMask = 0;

        for (let i = 0; i < modifiers.length; ++i) {
            keystrokeAction.modifierMask |= modifiers[i] << this.mapper.modifierMapper(i);
        }

        this.store.dispatch(
            KeymapActions.saveKey(
                this.keymap,
                this.currentLayer,
                event.moduleId,
                event.keyId,
                {
                    remapOnAllKeymap: event.shiftPressed,
                    remapOnAllLayer: event.altPressed,
                    action: keystrokeAction
                })
        );
    }

    onRemap(keyAction: KeyActionRemap): void {
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
        this.popoverInitKeyAction = null;
    }

    selectLayer(index: number): void {
        this.currentLayer = index;
    }

    getSelectedLayer(): number {
        return this.currentLayer;
    }

    onDescriptionChanged(description: string): void {
        this.descriptionChanged.emit({
            description,
            abbr: this.keymap.abbreviation
        });
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

            if (keystrokeAction.hasSecondaryRoleAction()) {
                content.push({
                    name: 'Secondary role',
                    value: SecondaryRoleAction[keystrokeAction.secondaryRoleAction]
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
                        value: switchLayerAction.switchLayerMode === SwitchLayerMode.toggle ? 'On' : 'Off'
                    }
                ];
            return Observable.of(content);
        }

        return Observable.of([]);
    }
}
