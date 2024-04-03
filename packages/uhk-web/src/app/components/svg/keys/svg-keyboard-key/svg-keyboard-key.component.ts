import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    HostBinding,
    HostListener,
    Input,
    OnChanges,
    OnDestroy,
    Output,
    ChangeDetectionStrategy,
    SimpleChanges,
    ViewChild
} from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { extend } from 'colord';
import { Key } from 'ts-keycode-enum';
import { Subscription } from 'rxjs';
import { colord } from 'colord';
import labPlugin from 'colord/plugins/lab';

import {
    BacklightingMode,
    KeyAction,
    KeyModifiers,
    KeystrokeAction,
    Macro,
    MouseAction,
    PlayMacroAction,
    SwitchKeymapAction,
    SwitchLayerAction,
    SwitchLayerMode
} from 'uhk-common';

import { CaptureService } from '../../../../services/capture.service';
import { KeyActionColoringService } from '../../../../services/key-action-coloring.service';
import { MapperService } from '../../../../services/mapper.service';

import { AppState } from '../../../../store';
import { initLayerOptions } from '../../../../store/reducers/layer-options';
import { SvgKeyCaptureEvent, SvgKeyClickEvent } from '../../../../models/svg-key-events';
import { OperatingSystem } from '../../../../models/operating-system';
import { KeyModifierModel } from '../../../../models/key-modifier-model';
import { StartKeypressCapturingAction, StopKeypressCapturingAction } from '../../../../store/actions/app';
import { KeyActionDragAndDropService } from '../../../../services/key-action-drag-and-drop.service';
import { getColorsOf } from '../../../../util/get-colors-of';
import { defaultUhkThemeColors } from '../../../../util/default-uhk-theme-colors';
import { keyboardGreyRgbColor } from '../../../../util/rgb-color-contants';
import { SvgKeyboardKey } from './svg-keyboard-key.model';

extend([labPlugin]);

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
        trigger('blink', [
            state('start', style({
                fill: '{{startColor}}'
            }), { params: { startColor: '#ffffff' } }),
            state('end', style({
                fill: '{{endColor}}'
            }), { params: { endColor: '#333333' } }),
            transition('start => end', animate('1000ms  ease-out'))
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
export class SvgKeyboardKeyComponent implements OnChanges, OnDestroy {
    @Input() backlightingMode: BacklightingMode;
    @Input() isActive = false;
    @Input() keyAction: KeyAction;
    @Input() svgKey: SvgKeyboardKey;
    @Input() capturingEnabled: boolean;
    @Input() macroMap = new Map<number, Macro>();
    @Input() blink: boolean;

    @Output() keyClick = new EventEmitter<SvgKeyClickEvent>();
    @Output() capture = new EventEmitter<SvgKeyCaptureEvent>();

    @ViewChild('svgRec', { static: false }) svgRec: ElementRef<HTMLElement>;

    blinkAnimation: 'start' | 'end' = 'end';
    enumLabelTypes = LabelTypes;
    fillColor = '#333';
    strokeColor = '';
    recordAnimation: string;
    recording: boolean;
    labelType: LabelTypes;

    labelSource: any;
    secondaryText: string;
    textColor: string;
    private scanCodePressed = false;
    private pressedShiftLocation = -1;
    private pressedAltLocation = -1;
    private altPressed = false;
    private shiftPressed = false;
    private subscriptions = new Subscription();
    private layerOptionMap = initLayerOptions();
    private isMouseMoveDispatched = false;
    private isMouseHover = false;

    constructor(
        private sanitizer: DomSanitizer,
        private mapper: MapperService,
        private store: Store<AppState>,
        private element: ElementRef,
        private cdRef: ChangeDetectorRef,
        private captureService: CaptureService,
        private dragAndDropService: KeyActionDragAndDropService,
        private mouseMoveService: KeyActionColoringService
    ) {
    }


    @HostBinding('@blink')
    get blinkAnimationBinding() {
        return {
            value: this.blinkAnimation,
            params: {
                startColor: this.textColor,
                endColor: this.fillColor,
            }
        };
    }

    @HostBinding('attr.original-fill-color')
    get originalFillColor(): SafeStyle {
        return this.fillColor;
    }

    @HostBinding('attr.fill')
    get fill(): SafeStyle {
        return this.fillColor;
    }

    @HostBinding('attr.stroke')
    get stroke(): SafeStyle {
        return this.strokeColor;
    }

    @HostBinding('attr.stroke-width')
    get strokeWidth(): SafeStyle {
        return this.isActive ? '3' : '1';
    }

    @HostBinding('style')
    get cursorStyle(): SafeStyle {
        if (this.mouseMoveService.isColoring) {
            const colors = getColorsOf(this.mouseMoveService.selectedBacklightingColor);
            const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" width="24" height="24"><path fill="${colors.svgFillColor}" stroke="${colors.svgStrokeColor}" stroke-width="20" d="M339.3 367.1c27.3-3.9 51.9-19.4 67.2-42.9L568.2 74.1c12.6-19.5 9.4-45.3-7.6-61.2S517.7-4.4 499.1 9.6L262.4 187.2c-24 18-38.2 46.1-38.4 76.1L339.3 367.1zm-19.6 25.4l-116-104.4C143.9 290.3 96 339.6 96 400c0 3.9 .2 7.8 .6 11.6C98.4 429.1 86.4 448 68.8 448H64c-17.7 0-32 14.3-32 32s14.3 32 32 32H208c61.9 0 112-50.1 112-112c0-2.5-.1-5-.2-7.5z"/></svg>`;

            return this.sanitizer.bypassSecurityTrustStyle(`cursor: url('data:image/svg+xml;utf8,${svg}') 0 24, pointer;`);
        }

        return undefined;
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

        if ((e.which === 0 || e.button === 0)) {
            this.mouseMoveService.leftButtonDown();
            this.dragAndDropService.leftButtonDown({
                keyId: this.svgKey.id,
                element: this.element.nativeElement,
                event: e
            });
        } else if ((e.which === 2 || e.button === 2) && this.capturingEnabled) {
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

    @HostListener('mouseenter', ['$event'])
    onMouseEnter(e: MouseEvent) {
        this.isMouseHover = true;
        this.setColors();
    }

    @HostListener('mousemove', ['$event'])
    onMouseMove(e: MouseEvent) {
        if (!this.isMouseMoveDispatched && this.mouseMoveService.shouldDispatchKeyColoring()) {
            this.isMouseMoveDispatched = true;
            this.keyClick.emit({
                keyTarget: this.element.nativeElement,
            });
        }
    }

    @HostListener('mouseleave', ['$event'])
    onMouseLeave(e: MouseEvent) {
        this.isMouseMoveDispatched = false;
        this.isMouseHover = false;
        this.setColors();
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

                this.scanCodePressed = true;
                this.saveScanCode(this.captureService.getMap(code));
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

        if (changes.keyAction || changes.isActive) {
            this.setColors();
        }

        if (changes['blink'] && changes['blink'].currentValue) {
            this.blinkSvgRec();
        }
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    @HostListener('@blink.done')
    onBlinkAnimationDone(): void {
        this.blinkAnimation = 'end';
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

        if (!this.scanCodePressed && !this.captureService.hasModifiers()) {
            return;
        }

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

        if (this.svgKey.width < 20) {
            if (this.keyAction instanceof KeystrokeAction) {
                if (!this.keyAction.hasActiveModifier()
                   && !this.keyAction.hasSecondaryRoleAction()
                   && this.keyAction.hasScancode()) {
                    const text = this.mapper.scanCodeToText(this.keyAction.scancode, this.keyAction.type);
                    if (text.length === 1) {
                        this.labelSource = text;
                    }
                }
            }

            if (this.labelSource === undefined) {
                this.labelSource = '•••';
            }
        }
        else if (this.keyAction instanceof KeystrokeAction) {
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
                        this.labelType = LabelTypes.IconText;
                    } else {
                        this.labelSource = newLabelSource;
                        this.labelType = LabelTypes.TwoLineText;
                    }
                }
            } else if (keyAction.hasOnlyOneActiveModifier() && !keyAction.hasScancode()) {
                switch (keyAction.modifierMask) {
                    case KeyModifiers.leftCtrl:
                    case KeyModifiers.rightCtrl:
                    case KeyModifiers.leftShift:
                    case KeyModifiers.rightShift:
                    case KeyModifiers.leftAlt:
                    case KeyModifiers.rightAlt:
                        this.labelSource = [this.mapper.getOsSpecificText(keyAction.modifierMask)];
                        break;
                    case KeyModifiers.leftGui:
                    case KeyModifiers.rightGui:
                        if (this.mapper.getOperatingSystem() === OperatingSystem.Windows) {
                            this.labelSource = this.mapper.getIcon('command');
                            this.labelType = LabelTypes.SingleIcon;
                        } else {
                            this.labelSource = [this.mapper.getOsSpecificText(keyAction.modifierMask)];
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
            const layerOption = this.layerOptionMap.get(keyAction.layer);
            const newLabelSource = layerOption?.name;

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
        this.blinkAnimation = 'start';
    }

    private setColors(): void {
        const isPerKeyBacklighting = this.backlightingMode === BacklightingMode.PerKeyBacklighting;
        const baseRgb = isPerKeyBacklighting
            ? this.keyAction
            : keyboardGreyRgbColor();

        const colors = getColorsOf(baseRgb);
        this.fillColor = colors.backgroundColorAsHex;
        this.textColor = colors.fontColorAsHex;
        this.strokeColor = '';
        const themeColors = defaultUhkThemeColors();

        if (isPerKeyBacklighting) {
            this.fillColor = colors.backgroundColorAsHex;
            this.strokeColor = colord(themeColors.backgroundColor).delta(this.keyAction) < 0.01
                ? 'lightgray'
                : '';

            if (this.isActive) {
                this.fillColor = colors.backgroundColorAsHex;
                const delta1 = colord(themeColors.selectedKeyColor).delta(this.keyAction);
                const delta2 = colord(themeColors.selectedKeyColor2).delta(this.keyAction);

                this.strokeColor = delta1 >= delta2
                    ? themeColors.selectedKeyColor
                    : themeColors.selectedKeyColor2;
            } else if (this.isMouseHover && !this.mouseMoveService.isColoring) {
                this.fillColor = colors.hoverColorAsHex;
            }
        } else {
            if (this.isActive) {
                this.fillColor = 'var(--color-keyboard-key-active)';
            } else if (this.isMouseHover) {
                this.fillColor = 'var(--color-keyboard-key-hover)';
            }
        }
    }
}
