import {
    Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, OnDestroy, OnInit, Output, Renderer,
    SimpleChange, ChangeDetectionStrategy
} from '@angular/core';
import { animate, group, state, style, transition, trigger } from '@angular/animations';

import { Store } from '@ngrx/store';

import { Subscription } from 'rxjs/Subscription';

import {
    KeyAction,
    KeyModifiers,
    KeystrokeAction,
    LayerName,
    Macro,
    MouseAction,
    PlayMacroAction,
    SwitchKeymapAction,
    SwitchLayerAction,
    SwitchLayerMode
} from 'uhk-common';

import { CaptureService } from '../../../../services/capture.service';
import { MapperService } from '../../../../services/mapper.service';

import { AppState } from '../../../../store';
import { getMacros } from '../../../../store/reducers/user-configuration';
import { SvgKeyCaptureEvent, SvgKeyClickEvent } from '../../../../models/svg-key-events';
import { OperatingSystem } from '../../../../models/operating-system';
import { KeyModifierModel } from '../../../../models/key-modifier-model';

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
        ]),
        trigger('active', [
            // http://colorblendy.com/#!/multiply/4099e5/cccccc
            state('1', style({ fill: '#4099e5' })), // Signature blue color blending
            transition('1 => *', animate('200ms')),
            transition('* => 1', animate('0ms')) // Instant color to blue
        ]),
        trigger('recording', [
            state('inactive', style({
                fill: 'rgba(204, 0, 0, 1)'
            })),
            state('active', style({
                fill: 'rgba(204, 0, 0, 0.6)'
            })),
            transition('inactive <=> active', animate('600ms ease-in-out'))
        ])
    ],
    selector: 'g[svg-keyboard-key]',
    templateUrl: './svg-keyboard-key.component.html',
    styleUrls: ['./svg-keyboard-key.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SvgKeyboardKeyComponent implements OnInit, OnChanges, OnDestroy {
    @Input() id: string;
    @Input() rx: string;
    @Input() ry: string;
    @Input() height: number;
    @Input() width: number;
    @Input() keyAction: KeyAction;
    @Input() keybindAnimationEnabled: boolean;
    @Input() capturingEnabled: boolean;
    @Input() active: boolean;

    @Output() keyClick = new EventEmitter<SvgKeyClickEvent>();
    @Output() capture = new EventEmitter<SvgKeyCaptureEvent>();

    enumLabelTypes = LabelTypes;

    changeAnimation: string = 'inactive';
    recordAnimation: string;
    recording: boolean;
    labelType: LabelTypes;

    labelSource: any;
    secondaryText: string;
    macros: Macro[];
    private subscription: Subscription;
    private scanCodePressed: boolean;
    private pressedShiftLocation = -1;
    private pressedAltLocation = -1;
    private altPressed = false;
    private shiftPressed = false;

    constructor(
        private mapper: MapperService,
        store: Store<AppState>,
        private element: ElementRef,
        private captureService: CaptureService,
        private renderer: Renderer
    ) {
        this.subscription = store.let(getMacros())
            .subscribe((macros: Macro[]) => this.macros = macros);

        this.reset();
        this.captureService.populateMapping();
        this.scanCodePressed = false;
    }

    @HostListener('click', ['$event'])
    onClick(e: MouseEvent) {
        this.reset();
        this.keyClick.emit({
            keyTarget: this.element.nativeElement,
            shiftPressed: e.shiftKey,
            altPressed: e.altKey
        });
        this.pressedShiftLocation = -1;
        this.pressedAltLocation = -1;
    }

    @HostListener('mousedown', ['$event'])
    onMouseDown(e: MouseEvent) {
        if ((e.which === 2 || e.button === 2) && this.capturingEnabled) {
            e.preventDefault();
            this.renderer.invokeElementMethod(this.element.nativeElement, 'focus');

            if (this.recording) {
                this.reset();
            } else {
                this.recording = true;
                this.recordAnimation = 'active';
                this.shiftPressed = e.shiftKey;
                this.altPressed = e.altKey;
            }
        }
    }

    @HostListener('document:keyup', ['$event'])
    onKeyUp(e: KeyboardEvent) {
        if (e.keyCode === 18 && this.pressedAltLocation > -1) {
            this.pressedAltLocation = -1;
            e.preventDefault();
        }
        else if (e.keyCode === 16 && this.pressedShiftLocation > -1) {
            this.pressedShiftLocation = -1;
            e.preventDefault();
        }
        else if (this.scanCodePressed) {
            e.preventDefault();
            this.scanCodePressed = false;
        } else if (this.recording) {
            e.preventDefault();
            this.saveScanCode();
        }
    }

    @HostListener('document:keydown', ['$event'])
    onKeyDown(e: KeyboardEvent) {
        const code: number = e.keyCode;

        if (this.recording) {
            e.preventDefault();

            if (this.captureService.hasMap(code)) {
                // If the Alt or Shift key not released after start the capturing
                // then add them as a modifier
                if (this.pressedShiftLocation > -1) {
                    this.captureService.setModifier((this.pressedShiftLocation === 1), 16);
                }

                if (this.pressedAltLocation > -1) {
                    this.captureService.setModifier((this.pressedAltLocation === 1), 18);
                }

                this.saveScanCode(this.captureService.getMap(code));
                this.scanCodePressed = true;
            } else {
                this.captureService.setModifier((e.location === 1), code);
            }
        } else {
            if (e.keyCode === 16) {
                this.pressedShiftLocation = e.location;
            }

            if (e.keyCode === 18) {
                this.pressedAltLocation = e.location;
            }
        }
    }

    @HostListener('focusout')
    onFocusOut() {
        this.reset();
    }

    ngOnInit() {
        this.setLabels();
    }

    ngOnChanges(changes: { [propertyName: string]: SimpleChange }) {
        if (changes['keyAction']) {
            this.setLabels();
            if (this.keybindAnimationEnabled) {
                this.changeAnimation = 'active';
            }
        }
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    onChangeAnimationDone() {
        this.changeAnimation = 'inactive';
    }

    onRecordingAnimationDone() {
        if (this.recording && this.recordAnimation === 'inactive') {
            this.recordAnimation = 'active';
        } else {
            this.recordAnimation = 'inactive';
        }
    }

    private reset() {
        this.recording = false;
        this.changeAnimation = 'inactive';
        this.captureService.initModifiers();
        this.shiftPressed = false;
        this.altPressed = false;
    }

    private saveScanCode(code = 0) {
        const left: KeyModifierModel[] = this.captureService.getModifiers(true);
        const right: KeyModifierModel[] = this.captureService.getModifiers(false);

        this.capture.emit({
            captured: {
                code,
                left,
                right
            },
            shiftPressed: this.shiftPressed,
            altPressed: this.altPressed
        });

        this.reset();
    }

    private setLabels(): void {
        this.labelType = LabelTypes.OneLineText;
        this.labelSource = undefined;
        this.secondaryText = undefined;

        if (!this.keyAction) {
            return;
        }

        if (this.keyAction instanceof KeystrokeAction) {
            const keyAction: KeystrokeAction = this.keyAction as KeystrokeAction;
            let newLabelSource: string[];
            this.secondaryText = this.mapper.getSecondaryRoleText(keyAction.secondaryRoleAction);

            if (!keyAction.hasActiveModifier() && keyAction.hasScancode()) {
                const scancode: number = keyAction.scancode;
                newLabelSource = this.mapper.scanCodeToText(scancode, keyAction.type);
                if (this.mapper.hasScancodeIcon(scancode, keyAction.type)) {
                    this.labelSource = this.mapper.scanCodeToSvgImagePath(scancode, keyAction.type);
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
                switch (keyAction.modifierMask) {
                    case KeyModifiers.leftCtrl:
                    case KeyModifiers.rightCtrl:
                        this.labelSource = ['Ctrl'];
                        break;
                    case KeyModifiers.leftShift:
                    case KeyModifiers.rightShift:
                        this.labelSource = ['Shift'];
                        break;
                    case KeyModifiers.leftAlt:
                    case KeyModifiers.rightAlt:
                        this.labelSource = [this.mapper.getOsSpecificText('Alt')];
                        break;
                    case KeyModifiers.leftGui:
                    case KeyModifiers.rightGui:
                        if (this.mapper.getOperatingSystem() === OperatingSystem.Windows) {
                            this.labelSource = this.mapper.getIcon('command');
                            this.labelType = LabelTypes.SingleIcon;
                        } else {
                            this.labelSource = [this.mapper.getOsSpecificText('Super')];
                        }
                        break;
                    default:
                        this.labelSource = ['Undefined'];
                        break;
                }
            } else {
                this.labelType = LabelTypes.KeystrokeKey;
                this.labelSource = this.keyAction;
            }
        } else if (this.keyAction instanceof SwitchLayerAction) {
            const keyAction: SwitchLayerAction = this.keyAction as SwitchLayerAction;
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

            if (keyAction.switchLayerMode === SwitchLayerMode.toggle) {
                this.labelType = LabelTypes.TextIcon;
                this.labelSource = {
                    text: newLabelSource,
                    icon: this.mapper.getIcon('toggle')
                };
            } else if (keyAction.switchLayerMode === SwitchLayerMode.holdAndDoubleTapToggle) {
                this.labelType = LabelTypes.TextIcon;
                this.labelSource = {
                    text: newLabelSource,
                    icon: this.mapper.getIcon('double-tap')
                };
            } else {
                this.labelType = LabelTypes.OneLineText;
                this.labelSource = newLabelSource;
            }
        } else if (this.keyAction instanceof SwitchKeymapAction) {
            const keyAction: SwitchKeymapAction = this.keyAction as SwitchKeymapAction;
            this.labelType = LabelTypes.SwitchKeymap;
            this.labelSource = keyAction.keymapAbbreviation;
        } else if (this.keyAction instanceof PlayMacroAction) {
            const keyAction: PlayMacroAction = this.keyAction as PlayMacroAction;
            const macro: Macro = this.macros.find((_macro: Macro) => _macro.id === keyAction.macroId);
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
