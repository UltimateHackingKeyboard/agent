import { Component, EventEmitter, Input, Output, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { animate, state, trigger, style, transition } from '@angular/animations';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { HalvesInfo, Module } from 'uhk-common';

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
            transition('* <=> *', animate(500))
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
            state('visible', style({
                opacity: 1
            })),
            state('invisible', style({
                opacity: 0
            })),
            transition('visible => invisible', animate('200ms')),
            transition('invisible => visible', animate('200ms 500ms'))
        ]),
        trigger('moveDescription', [
            state('down', style({
                'margin-top': '0.5em'
            })),
            state('up', style({
                'margin-top': '-6.5%'
            })),
            transition('down => up', animate(500)),
            transition('up => down', animate(500))
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
    moduleAnimationStates: string[];
    moduleVisibilityAnimationStates: string[];
    separator: SvgSeparator;
    separatorStyle: SafeStyle;
    separatorAnimation = 'visible';
    descriptionAnimation = 'down';

    constructor(private svgModuleProvider: SvgModuleProviderService,
                private sanitizer: DomSanitizer) {
        this.modules = [];
        this.viewBox = '-520 582 1100 470';
        this.moduleAnimationStates = [];
        this.moduleVisibilityAnimationStates = [];
    }

    ngOnInit() {
        this.setModules();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.halvesInfo) {
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

    private updateModuleAnimationStates() {
        if (this.halvesInfo.areHalvesMerged) {
            this.moduleAnimationStates = [];
            this.separatorAnimation = 'visible';
            this.descriptionAnimation = 'down';
        } else {
            this.moduleAnimationStates = ['rotateRight', 'rotateLeft'];
            this.separatorAnimation = 'invisible';
            this.descriptionAnimation = 'up';
        }

        if (this.halvesInfo.isLeftHalfConnected) {
            this.moduleVisibilityAnimationStates = ['visible', 'visible'];
        } else {
            this.moduleVisibilityAnimationStates = ['visible', 'invisible'];

        }
    }

    private setModules() {
        this.modules = this.svgModuleProvider.getSvgModules(this.keyboardLayout);
        this.separator = this.svgModuleProvider.getSvgSeparator();
        this.separatorStyle = this.sanitizer.bypassSecurityTrustStyle(this.separator.style);
    }
}
