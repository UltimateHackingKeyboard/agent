import {
    ChangeDetectionStrategy, ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    HostBinding,
    HostListener,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges,
    ViewChild
} from '@angular/core';

import { Observable, of, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import {
    camelCaseToSentence,
    capitalizeFirstLetter,
    HalvesInfo,
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
import { AppState, getKeymaps, getMacros, getAnimationEnabled, getLayerOptions, getSelectedLayerOption } from '../../../store';
import { AddLayerAction, RemoveLayerAction, SaveKeyAction, SelectLayerAction } from '../../../store/actions/keymap';
import { PopoverComponent } from '../../popover';
import { KeyboardLayout } from '../../../keyboard/keyboard-layout.enum';
import { ChangeKeymapDescription } from '../../../models/ChangeKeymapDescription';
import { KeyActionRemap } from '../../../models/key-action-remap';
import {
    SvgKeyboardCaptureEvent,
    SvgKeyboardKeyClickEvent,
    SvgKeyHoverEvent
} from '../../../models/svg-key-events';
import { RemapInfo } from '../../../models/remap-info';
import { findModuleById, mapLeftRightModifierToKeyActionModifier } from '../../../util';
import { LastEditedKey, LayerOption } from '../../../models';
import { animate, style, transition, trigger } from '@angular/animations';

interface NameValuePair {
    name: string;
    value: string;
}

@Component({
    selector: 'svg-keyboard-wrap',
    templateUrl: './svg-keyboard-wrap.component.html',
    styleUrls: ['./svg-keyboard-wrap.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        trigger('popover', [
            transition(':leave', [
                style({
                    transform: 'translateY(0)',
                    visibility: 'visible',
                    opacity: 1
                }),
                animate('{{animationTime}} ease-out', style({
                    transform: 'translateY(30px)',
                    visibility: 'hidden',
                    opacity: 0
                }))
            ]),
            transition(':enter', [
                style({
                    transform: 'translateY(30px)',
                    visibility: 'hidden',
                    opacity: 0
                }),
                animate('{{animationTime}} ease-out', style({
                    transform: 'translateY(0)',
                    visibility: 'visible',
                    opacity: 1
                }))
            ])
        ])
    ]
})
export class SvgKeyboardWrapComponent implements OnInit, OnChanges, OnDestroy {
    @Input() keymap: Keymap;
    @Input() popoverEnabled: boolean = true;
    @Input() tooltipEnabled: boolean = false;
    @Input() halvesInfo: HalvesInfo;
    @Input() keyboardLayout: KeyboardLayout.ANSI;
    @Input() allowLayerDoubleTap: boolean;
    @Input() lastEditedKey: LastEditedKey;

    @Output() descriptionChanged = new EventEmitter<ChangeKeymapDescription>();

    @ViewChild(PopoverComponent, { read: ElementRef, static: false }) popover: ElementRef;

    animationEnabled = true;
    animationState: 'opened' | 'closed';
    keyEditConfig: { moduleId: number, keyId: number };
    selectedKey: { layerId: number, moduleId: number, keyId: number };
    popoverInitKeyAction: KeyAction;
    currentLayer: LayerOption;
    tooltipData: {
        posTop: number,
        posLeft: number,
        content: Observable<NameValuePair[]>,
        show: boolean
    };
    layers: Layer[];
    keyPosition: ClientRect;
    wrapPosition: ClientRect;
    remapInfo: RemapInfo = {
        remapOnAllKeymap: false,
        remapOnAllLayer: false
    };
    leftArrow: boolean = false;
    rightArrow: boolean = false;
    topPosition: number = 0;
    leftPosition: number = 0;
    layerOptions: LayerOption[];

    private wrapHost: HTMLElement;
    private keyElement: HTMLElement;
    private subscription = new Subscription();

    constructor(
        private store: Store<AppState>,
        private mapper: MapperService,
        private element: ElementRef,
        private cdRef: ChangeDetectorRef
    ) {
        this.animationState = 'closed';
        this.keyEditConfig = {
            moduleId: undefined,
            keyId: undefined
        };

        this.tooltipData = {
            posTop: 0,
            posLeft: 0,
            content: of([]),
            show: false
        };

        this.subscription.add(
            this.store
                .select(getAnimationEnabled)
                .subscribe(value => this.animationEnabled = value)
        );

        this.subscription.add(
            this.store
                .select(getLayerOptions)
                .subscribe(value => this.layerOptions = value)
        );

        this.subscription.add(
            this.store
                .select(getSelectedLayerOption)
                .subscribe(value => this.currentLayer = value)
        );
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
        if (this.animationState === 'opened') {
            this.calculatePosition();
            this.cdRef.markForCheck();
        }
    }

    ngOnInit() {
        this.wrapHost = this.element.nativeElement;
        this.wrapPosition = this.wrapHost.getBoundingClientRect();
    }

    ngOnChanges(changes: SimpleChanges) {
        const keymapChanges = changes['keymap'];
        if (keymapChanges) {
            this.animationState = 'closed';
            this.layers = this.keymap.layers;
        }
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    get animationTime(): string {
        return this.animationEnabled ? '200ms' : '0ms';
    }

    onKeyClick(event: SvgKeyboardKeyClickEvent): void {
        if (this.animationState === 'closed' && this.popoverEnabled) {
            this.keyEditConfig = {
                moduleId: event.moduleId,
                keyId: event.keyId
            };
            this.selectedKey = { layerId: this.currentLayer.id, moduleId: event.moduleId, keyId: event.keyId };
            const keyActionToEdit: KeyAction = this.layers
                .find(layer => layer.id === this.currentLayer.id)
                .modules
                .find(findModuleById(event.moduleId))
                .keyActions[event.keyId];
            this.keyElement = event.keyTarget;
            this.remapInfo = {
                remapOnAllKeymap: event.shiftPressed,
                remapOnAllLayer: event.altPressed
            };
            this.showPopover(keyActionToEdit);
        }
    }

    onKeyHover(event: SvgKeyHoverEvent): void {
        if (this.tooltipEnabled) {
            const keyActionToEdit: KeyAction = this.layers
                .find(layer => layer.id === this.currentLayer.id)
                .modules
                .find(findModuleById(event.moduleId))
                .keyActions[event.keyId];

            if (event.over) {
                this.showTooltip(keyActionToEdit, event.event);
            } else {
                this.hideTooltip();
            }
        }
    }

    onCapture(event: SvgKeyboardCaptureEvent): void {
        const keystrokeAction: KeystrokeAction = new KeystrokeAction();

        keystrokeAction.scancode = event.captured.code;
        keystrokeAction.modifierMask = mapLeftRightModifierToKeyActionModifier(event.captured.left, event.captured.right);

        this.store.dispatch(
            new SaveKeyAction({
                keymap: this.keymap,
                layer: this.currentLayer.id,
                module: event.moduleId,
                key: event.keyId,
                keyAction: {
                    remapOnAllKeymap: event.shiftPressed,
                    remapOnAllLayer: event.altPressed,
                    action: keystrokeAction
                }
            })
        );
    }

    onRemap(keyAction: KeyActionRemap): void {
        this.store.dispatch(
            new SaveKeyAction({
                keymap: this.keymap,
                layer: this.currentLayer.id,
                module: this.keyEditConfig.moduleId,
                key: this.keyEditConfig.keyId,
                keyAction
            })
        );
        this.hidePopover();
    }

    onAddLayer(id: number): void {
        this.store.dispatch(new AddLayerAction(id));
    }

    onRemoveLayer(id: number): void {
        this.store.dispatch(new RemoveLayerAction(id));
    }

    showPopover(keyAction: KeyAction): void {
        this.keyPosition = this.keyElement.getBoundingClientRect();
        this.calculatePosition();
        this.popoverInitKeyAction = keyAction;
        this.animationState = 'opened';
        this.cdRef.markForCheck();
        setTimeout(() => {
            this.popover.nativeElement.focus();
        }, 10);
    }

    showTooltip(keyAction: KeyAction, event: MouseEvent): void {
        if (keyAction === undefined) {
            return;
        }

        const el = event.target as Element;
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
        this.animationState = 'closed';
        this.selectedKey = undefined;
        this.popoverInitKeyAction = null;
    }

    selectLayer(option: LayerOption): void {
        this.store.dispatch(new SelectLayerAction(option));
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
            return of(content);
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
            return of(content);
        } else if (keyAction instanceof PlayMacroAction) {
            const playMacroAction: PlayMacroAction = keyAction;
            return this.store
                .select(getMacros)
                .pipe(
                    map(macroState => macroState.find(macro => {
                        return macro.id === playMacroAction.macroId;
                    }).name),
                    map(macroName => {
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
                    })
                );
        } else if (keyAction instanceof SwitchKeymapAction) {
            const switchKeymapAction: SwitchKeymapAction = keyAction;
            return this.store
                .select(getKeymaps)
                .pipe(
                    map(keymaps => keymaps.find(keymap => keymap.abbreviation === switchKeymapAction.keymapAbbreviation).name),
                    map(keymapName => {
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
                    })
                );
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
            return of(content);
        }

        return of([]);
    }

    private calculatePosition() {
        const popoverWidth = 600;
        const offsetLeft: number = this.wrapPosition.left + 249; // 265 is a width of the side menu with a margin
        let newLeft: number = this.keyPosition.left + (this.keyPosition.width / 2);

        this.leftArrow = newLeft < offsetLeft;
        this.rightArrow = (newLeft + popoverWidth) > offsetLeft + this.wrapPosition.width;

        const splitOffset = this.halvesInfo.areHalvesMerged ? 0 : 17;

        if (this.leftArrow) {
            newLeft = this.keyPosition.left - splitOffset;
        } else if (this.rightArrow) {
            newLeft = this.keyPosition.left - popoverWidth + this.keyPosition.width + splitOffset * 1.5;
        } else {
            newLeft -= popoverWidth / 2;
        }

        // 7 is a space between a bottom key position and a popover
        this.topPosition = this.keyPosition.top + this.keyPosition.height + 7 + window.scrollY;
        this.leftPosition = newLeft;
    }
}
