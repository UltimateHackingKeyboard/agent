import { Component, EventEmitter, Input, Output, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { animate, state, trigger, style, transition } from '@angular/animations';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { HalvesInfo, KeyAction, LeftSlotModules, Module, RightSlotModules } from 'uhk-common';

import { SvgModule } from '../module';
import { SvgModuleProviderService } from '../../../services/svg-module-provider.service';
import { KeyboardLayout } from '../../../keyboard/keyboard-layout.enum';
import { SvgSeparator } from '../separator';
import {
    SvgKeyHoverEvent,
    SvgKeyboardKeyClickEvent,
    SvgKeyboardCaptureEvent,
    SvgModuleKeyClickEvent
} from '../../../models/svg-key-events';
import { LastEditedKey } from '../../../models';
import { findModuleById } from '../../../util';

@Component({
    selector: 'svg-keyboard',
    templateUrl: './svg-keyboard.component.html',
    styleUrls: ['./svg-keyboard.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        trigger('split', [
            state('rotateLeft', style({
                transform: 'translate(2%, 30%) rotate(10.8deg) scale(0.80, 0.80)'
            })),
            state('rotateRight', style({
                transform: 'translate(-2%, 30.7%) rotate(-10deg) scale(0.80, 0.80)'
            })),
            transition('merged <=> rotateLeft', animate(500)),
            transition('merged <=> rotateRight', animate(500))
        ]),
        trigger('fadeKeyboard', [
            state('visible', style({
                opacity: 1
            })),
            state('invisible', style({
                opacity: 0
            })),
            transition('visible => invisible', animate(500)),
            transition('invisible => visible', animate(500))
        ]),
        trigger('fadeSeparator', [
            transition(':enter', [
                style({ opacity: 0 }),
                animate('200ms 500ms', style({ opacity: 1 }))
            ]),
            transition(':leave', [
                style({ opacity: 1 }),
                animate('200ms', style({ opacity: 0 }))
            ])
        ]),
        trigger('moveDescription', [
            state('down', style({
                'margin-top': '0.5em'
            })),
            state('up', style({
                'margin-top': '-6.5%'
            })),
            state('up2', style({
                'margin-top': '-2.5%'
            })),
            transition('down => up', animate(500)),
            transition('down => up2', animate(500)),
            transition('up => down', animate(500)),
            transition('up => up2', animate(500)),
            transition('up2 => down', animate(500)),
            transition('up2 => up', animate(500))
        ])
    ]
})
export class SvgKeyboardComponent {
    @Input() moduleConfig: Module[];
    @Input() capturingEnabled: boolean;
    @Input() selectedKey: { layerId: number, moduleId: number, keyId: number };
    @Input() selected: boolean;
    @Input() halvesInfo: HalvesInfo;
    @Input() keyboardLayout = KeyboardLayout.ANSI;
    @Input() description: string;
    @Input() showDescription = false;
    @Input() lastEditedKey: LastEditedKey;
    @Output() keyClick = new EventEmitter<SvgKeyboardKeyClickEvent>();
    @Output() keyHover = new EventEmitter<SvgKeyHoverEvent>();
    @Output() capture = new EventEmitter<SvgKeyboardCaptureEvent>();
    @Output() descriptionChanged = new EventEmitter<string>();

    modules: SvgModule[];
    viewBox: string;
    modulesState: Record<number, {
        visibility: 'visible' | 'invisible';
        animation: 'merged' | 'rotateLeft' | 'rotateRight'
    }>;
    separator: SvgSeparator;
    separatorStyle: SafeStyle;
    descriptionAnimation = 'down';

    constructor(private svgModuleProvider: SvgModuleProviderService,
                private sanitizer: DomSanitizer) {
        this.modules = [];
        this.viewBox = '-520 582 1100 470';
        this.modulesState = {};
    }

    ngOnInit() {
        this.setModules();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.halvesInfo) {
            this.setModules();
            this.updateModuleAnimationStates();
        }

        if (changes['keyboardLayout']) {
            this.setModules();
        }
    }

    onKeyClick(moduleId: number, event: SvgModuleKeyClickEvent): void {
        this.keyClick.emit({
            ...event,
            moduleId
        });
    }

    onCapture(moduleId: number, event: SvgKeyboardCaptureEvent): void {
        this.capture.emit({
            ...event,
            moduleId
        });
    }

    onKeyHover(keyId: number, event: MouseEvent, over: boolean, moduleId: number): void {
        this.keyHover.emit({
            moduleId,
            event,
            over,
            keyId
        });
    }

    getKeyActions(id: number): KeyAction[] {
        if (!this.moduleConfig) {
            return [];
        }

        const moduleConf = this.moduleConfig.find(findModuleById(id));

        if (moduleConf) {
            return  moduleConf.keyActions;
        }

        return [];
    }

    private updateModuleAnimationStates() {
        if (this.halvesInfo.areHalvesMerged) {
            this.modulesState = {
                0: {
                    animation: 'merged',
                    visibility: 'visible'
                },
                1: {
                    animation: 'merged',
                    visibility: this.halvesInfo.isLeftHalfConnected ? 'visible' : 'invisible'
                }
            };
            this.descriptionAnimation = 'down';
        } else {
            this.modulesState = {
                0: {
                    animation: 'rotateRight',
                    visibility: 'visible'
                },
                1: {
                    animation: 'rotateLeft',
                    visibility: this.halvesInfo.isLeftHalfConnected ? 'visible' : 'invisible'
                }
            };
            this.descriptionAnimation = 'up';

            if (this.halvesInfo.rightModuleSlot !== RightSlotModules.NoModule) {
                this.modulesState[this.halvesInfo.rightModuleSlot] = {
                    animation: 'rotateRight',
                    visibility: 'visible'
                };
                this.descriptionAnimation = 'up2';
            }

            if (this.halvesInfo.leftModuleSlot !== LeftSlotModules.NoModule) {
                this.modulesState[this.halvesInfo.leftModuleSlot] = {
                    animation: 'rotateLeft',
                    visibility: 'visible'
                };
                this.descriptionAnimation = 'up2';
            }
        }
    }

    private setModules() {
        this.modules = this.svgModuleProvider.getSvgModules(this.keyboardLayout, this.halvesInfo);
        this.separator = this.svgModuleProvider.getSvgSeparator();
        this.separatorStyle = this.sanitizer.bypassSecurityTrustStyle(this.separator.style);
    }
}
