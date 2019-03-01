import { Component, EventEmitter, Input, Output, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { animate, state, trigger, style, transition } from '@angular/animations';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { Module } from 'uhk-common';

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

@Component({
    selector: 'svg-keyboard',
    templateUrl: './svg-keyboard.component.html',
    styleUrls: ['./svg-keyboard.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        trigger('split', [
            state('rotateLeft', style({
                transform: 'translate(-3%, 15%) rotate(4deg) scale(0.92, 0.92)'
            })),
            state('rotateRight', style({
                transform: 'translate(3%, 15%) rotate(-4deg) scale(0.92, 0.92)'
            })),
            transition('* <=> *', animate(500))
        ]),
        trigger('fadeSeparator', [
            state('visible', style({
                opacity: 1
            })),
            state('invisible', style({
                opacity: 0
            })),
            transition('visible => invisible', animate(500)),
            transition('invisible => visible', animate(1500))
        ])
    ]
})
export class SvgKeyboardComponent {
    @Input() moduleConfig: Module[];
    @Input() keybindAnimationEnabled: boolean;
    @Input() capturingEnabled: boolean;
    @Input() selectedKey: { layerId: number, moduleId: number, keyId: number };
    @Input() selected: boolean;
    @Input() halvesSplit: boolean;
    @Input() keyboardLayout = KeyboardLayout.ANSI;
    @Input() description: string;
    @Input() showDescription = false;
    @Output() keyClick = new EventEmitter<SvgKeyboardKeyClickEvent>();
    @Output() keyHover = new EventEmitter<SvgKeyHoverEvent>();
    @Output() capture = new EventEmitter<SvgKeyboardCaptureEvent>();
    @Output() descriptionChanged = new EventEmitter<string>();

    modules: SvgModule[];
    viewBox: string;
    moduleAnimationStates: string[];
    separator: SvgSeparator;
    separatorStyle: SafeStyle;
    separatorAnimation = 'visible';

    constructor(private svgModuleProvider: SvgModuleProviderService,
                private sanitizer: DomSanitizer) {
        this.modules = [];
        this.viewBox = '-520 582 1100 470';
        this.halvesSplit = false;
        this.moduleAnimationStates = [];
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.halvesSplit) {
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
        if (this.halvesSplit) {
            this.moduleAnimationStates = ['rotateRight', 'rotateLeft'];
            this.separatorAnimation = 'invisible';
        } else {
            this.moduleAnimationStates = [];
            this.separatorAnimation = 'visible';
        }
    }

    private setModules() {
        this.modules = this.svgModuleProvider.getSvgModules(this.keyboardLayout);
        this.separator = this.svgModuleProvider.getSvgSeparator();
        this.separatorStyle = this.sanitizer.bypassSecurityTrustStyle(this.separator.style);
    }
}
