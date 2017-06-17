import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { animate, state, trigger, style, transition } from '@angular/animations';

import { Module } from '../../../config-serializer/config-items/Module';
import { SvgModule } from '../module';
import { SvgModuleProviderService } from '../../../services/svg-module-provider.service';

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
        ])
    ]
})
export class SvgKeyboardComponent implements OnInit {
    @Input() moduleConfig: Module[];
    @Input() keybindAnimationEnabled: boolean;
    @Input() capturingEnabled: boolean;
    @Input() selectedKey: { layerId: number, moduleId: number, keyId: number };
    @Input() selected: boolean;
    @Input() halvesSplit: boolean;
    @Output() keyClick = new EventEmitter();
    @Output() keyHover = new EventEmitter();
    @Output() capture = new EventEmitter();

    modules: SvgModule[];
    viewBox: string;
    moduleAnimationStates: string[];

    constructor(private svgModuleProvider: SvgModuleProviderService) {
        this.modules = [];
        this.viewBox = '-520 582 1100 470';
        this.halvesSplit = false;
        this.moduleAnimationStates = [];
    }

    ngOnInit() {
        this.modules = this.svgModuleProvider.getSvgModules();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.halvesSplit) {
            this.updateModuleAnimationStates();
        }
    }

    onKeyClick(moduleId: number, keyId: number, keyTarget: HTMLElement): void {
        this.keyClick.emit({
            moduleId,
            keyId,
            keyTarget
        });
    }

    onCapture(moduleId: number, keyId: number, captured: { code: number, left: boolean[], right: boolean[] }): void {
        this.capture.emit({
            moduleId,
            keyId,
            captured
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
        } else {
            this.moduleAnimationStates = [];
        }
    }

}
