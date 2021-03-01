import {
    Component,
    EventEmitter,
    Input,
    Output,
    SimpleChanges,
    ChangeDetectionStrategy,
    AfterViewInit,
    ChangeDetectorRef
} from '@angular/core';
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
        trigger('fadeKeyboard', [
            transition(':enter', [
                style({ opacity: 0 }),
                animate('{{animationTime}}', style({ opacity: 1 }))
            ], { params: { animationTime: '0ms' } }),
            transition(':leave', [
                style({ opacity: 1 }),
                animate('500ms', style({ opacity: 0 }))
            ])
        ]),
        trigger('fadeSeparator', [
            transition(':enter', [
                style({ opacity: 0 }),
                animate('{{animationTime}}', style({ opacity: 1 }))
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
            state('upLeftKeyCluster', style({
                'margin-top': '-2.5%'
            })),
            state('upRightModule', style({
                'margin-top': '-4%'
            })),
            transition('down => up', animate(500)),
            transition('down => upLeftKeyCluster', animate(500)),
            transition('down => upRightModule', animate(500)),
            transition('up => down', animate(500)),
            transition('up => upLeftKeyCluster', animate(500)),
            transition('up => upRightModule', animate(500)),
            transition('upLeftKeyCluster => down', animate(500)),
            transition('upLeftKeyCluster => up', animate(500)),
            transition('upLeftKeyCluster => upRightModule', animate(500)),
            transition('upRightModule => down', animate(500)),
            transition('upRightModule => up', animate(500)),
            transition('upRightModule => upLeftKeyCluster', animate(500))
        ])
    ]
})
export class SvgKeyboardComponent implements AfterViewInit {
    @Input() moduleConfig: Module[];
    @Input() capturingEnabled: boolean;
    @Input() selectedKey: { layerId: number, moduleId: number, keyId: number };
    @Input() selected: boolean;
    @Input() halvesInfo: HalvesInfo;
    @Input() keyboardLayout = KeyboardLayout.ANSI;
    @Input() description: string;
    @Input() showDescription = false;
    @Input() lastEditedKey: LastEditedKey;
    @Input() embedded = false;
    @Output() keyClick = new EventEmitter<SvgKeyboardKeyClickEvent>();
    @Output() keyHover = new EventEmitter<SvgKeyHoverEvent>();
    @Output() capture = new EventEmitter<SvgKeyboardCaptureEvent>();
    @Output() descriptionChanged = new EventEmitter<string>();

    modules: SvgModule[];
    viewBox: string;
    modulesState: Record<number, {
        animationTime: string;
        cssClasses: {
            'module-merged': boolean,
            'module-rotate-left': boolean;
            'module-rotate-right': boolean;
        }
    }>;
    separator: SvgSeparator;
    separatorStyle: SafeStyle;
    descriptionAnimation = 'down';
    fadeSeparatorAnimationTime = '200ms 500ms';

    private isAfterViewInit = false;

    constructor(private svgModuleProvider: SvgModuleProviderService,
                private sanitizer: DomSanitizer,
                private cdRef: ChangeDetectorRef) {
        this.modules = [];
        this.viewBox = '-520 582 1100 470';
        this.modulesState = {};
        this.halvesInfo = {
            areHalvesMerged: true,
            isLeftHalfConnected: true,
            leftModuleSlot: LeftSlotModules.NoModule,
            rightModuleSlot: RightSlotModules.NoModule
        };
        this.setModules();
        this.updateModuleAnimationStates();
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

        if (changes.embedded) {
            this.fadeSeparatorAnimationTime = this.embedded ? '0ms' : '200ms 500ms';
        }
    }

    ngAfterViewInit() {
        this.isAfterViewInit = true;
        this.cdRef.markForCheck();
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

    trackByModuleFn(index: number, module: Module): string {
        return module.id.toString();
    }

    private updateModuleAnimationStates() {
        if (this.halvesInfo.areHalvesMerged) {
            this.modulesState = {
                0: {
                    animationTime: this.fadeAnimationTime(),
                    cssClasses: {
                        'module-merged': true,
                        'module-rotate-left': false,
                        'module-rotate-right': false
                    }
                },
                1: {
                    animationTime: this.fadeAnimationTime(),
                    cssClasses: {
                        'module-merged': true,
                        'module-rotate-left': false,
                        'module-rotate-right': false
                    }
                }
            };
            this.descriptionAnimation = 'down';
        } else {
            this.modulesState = {
                0: {
                    animationTime: this.fadeAnimationTime(),
                    cssClasses: {
                        'module-merged': false,
                        'module-rotate-left': false,
                        'module-rotate-right': true
                    }
                },
                1: {
                    animationTime: this.fadeAnimationTime(),
                    cssClasses: {
                        'module-merged': false,
                        'module-rotate-left': true,
                        'module-rotate-right': false
                    }
                }
            };
            this.descriptionAnimation = 'up';

            if (this.halvesInfo.rightModuleSlot !== RightSlotModules.NoModule) {
                this.modulesState[this.halvesInfo.rightModuleSlot] = {
                    animationTime: this.fadeAnimationTime(),
                    cssClasses: {
                        'module-merged': false,
                        'module-rotate-left': false,
                        'module-rotate-right': true
                    }
                };
                this.descriptionAnimation = 'upRightModule';
            }

            if (this.halvesInfo.leftModuleSlot !== LeftSlotModules.NoModule) {
                this.modulesState[this.halvesInfo.leftModuleSlot] = {
                    animationTime: this.fadeAnimationTime(),
                    cssClasses: {
                        'module-merged': false,
                        'module-rotate-left': true,
                        'module-rotate-right': false
                    }
                };
                this.descriptionAnimation = 'upLeftKeyCluster';
            }
        }
    }

    private fadeAnimationTime(): string {
        if (this.embedded) {
            return '0ms';
        }

        return this.isAfterViewInit ? '500ms' : '0ms';
    }

    private setModules() {
        this.modules = this.svgModuleProvider.getSvgModules(this.keyboardLayout, this.halvesInfo);
        this.separator = this.svgModuleProvider.getSvgSeparator();
        this.separatorStyle = this.sanitizer.bypassSecurityTrustStyle(this.separator.style);
    }
}
