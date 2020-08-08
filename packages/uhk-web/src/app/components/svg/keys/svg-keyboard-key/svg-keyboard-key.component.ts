import {
    Component,
    ElementRef,
    EventEmitter,
    HostListener,
    Input,
    OnChanges,
    Output,
    ChangeDetectionStrategy,
    SimpleChanges,
    ViewChild
} from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Store } from '@ngrx/store';
import { Key } from 'ts-keycode-enum';

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
import { SvgKeyCaptureEvent, SvgKeyClickEvent } from '../../../../models/svg-key-events';
import { OperatingSystem } from '../../../../models/operating-system';
import { KeyModifierModel } from '../../../../models/key-modifier-model';
import { StartKeypressCapturingAction, StopKeypressCapturingAction } from '../../../../store/actions/app';

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
export class SvgKeyboardKeyComponent implements OnChanges {
    @Input() id: string;
    @Input() rx: string;
    @Input() ry: string;
    @Input() height: number;
    @Input() width: number;
    @Input() keyAction: KeyAction;
    @Input() capturingEnabled: boolean;
    @Input() active: boolean;
    @Input() macroMap = new Map<number, Macro>();
    @Input() blink: boolean;

    @Output() keyClick = new EventEmitter<SvgKeyClickEvent>();
    @Output() capture = new EventEmitter<SvgKeyCaptureEvent>();

    @ViewChild('svgRec', { static: false }) svgRec: ElementRef<HTMLElement>;

    enumLabelTypes = LabelTypes;

    recordAnimation: string;
    recording: boolean;
    labelType: LabelTypes;

    labelSource: any;
    secondaryText: string;
    private scanCodePressed = false;
    private pressedShiftLocation = -1;
    private pressedAltLocation = -1;
    private altPressed = false;
    private shiftPressed = false;

    constructor(
        private mapper: MapperService,
        private store: Store<AppState>,
        private element: ElementRef,
        private captureService: CaptureService
    ) {
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
            this.element.nativeElement.focus();

            if (this.recording) {
                this.reset();
            } else {
                this.recording = true;
                this.recordAnimation = 'active';
                this.shiftPressed = e.shiftKey;
                this.altPressed = e.altKey;
                this.store.dispatch(new StartKeypressCapturingAction());
            }
        }
    }

    @HostListener('document:keyup', ['$event'])
    onKeyUp(e: KeyboardEvent) {
        if (e.keyCode === Key.Alt && this.pressedAltLocation > -1) {
            this.pressedAltLocation = -1;
            e.preventDefault();
        } else if (e.keyCode === Key.Shift && this.pressedShiftLocation > -1) {
            this.pressedShiftLocation = -1;
            e.preventDefault();
        } else if (this.scanCodePressed) {
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
                    this.captureService.setModifier((this.pressedShiftLocation === 1), Key.Shift);
                }

                if (this.pressedAltLocation > -1) {
                    this.captureService.setModifier((this.pressedAltLocation === 1), Key.Alt);
                }

                this.saveScanCode(this.captureService.getMap(code));
                this.scanCodePressed = true;
            } else {
                this.captureService.setModifier((e.location === 1), code);
            }
        } else {
            if (e.keyCode === Key.Shift) {
                this.pressedShiftLocation = e.location;
            }

            if (e.keyCode === Key.Alt) {
                this.pressedAltLocation = e.location;
            }
        }
    }

    @HostListener('focusout')
    onFocusOut() {
        this.reset();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['keyAction']) {
            this.setLabels();
        }

        if (changes['blink'] && changes['blink'].currentValue) {
            this.blinkSvgRec();
        }
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
        this.captureService.initModifiers();
        this.shiftPressed = false;
        this.altPressed = false;
        this.store.dispatch(new StopKeypressCapturingAction());
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
                    } else if (newLabelSource[1].startsWith('icon')) {
                        this.labelSource = {
                            text: newLabelSource[0],
                            icon: this.mapper.getIcon(newLabelSource[1])
                        };
                        this.labelType = LabelTypes.TextIcon;
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
            const macro: Macro = this.macroMap.get(keyAction.macroId);
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

    private blinkSvgRec(): void {
        if (this.svgRec) {
            this.svgRec.nativeElement.classList.remove('blink');
            setTimeout(() => {
                if (this.svgRec) {
                    this.svgRec.nativeElement.classList.add('blink');
                }
            }, 10);
        }
    }
}
