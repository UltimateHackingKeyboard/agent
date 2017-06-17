import { Component, EventEmitter, Input, OnInit, Output, ChangeDetectionStrategy } from '@angular/core';

import { Module } from '../../../config-serializer/config-items/Module';
import { SvgModule } from '../module';
import { SvgModuleProviderService } from '../../../services/svg-module-provider.service';

@Component({
    selector: 'svg-keyboard',
    templateUrl: './svg-keyboard.component.html',
    styleUrls: ['./svg-keyboard.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SvgKeyboardComponent implements OnInit {
    @Input() moduleConfig: Module[];
    @Input() keybindAnimationEnabled: boolean;
    @Input() capturingEnabled: boolean;
    @Input() selectedKey: { layerId: number, moduleId: number, keyId: number };
    @Input() selected: boolean;
    @Output() keyClick = new EventEmitter();
    @Output() keyHover = new EventEmitter();
    @Output() capture = new EventEmitter();

    modules: SvgModule[];
    viewBox: string;

    constructor(private svgModuleProvider: SvgModuleProviderService) {
        this.modules = [];
        this.viewBox = '-520 582 1100 470';
    }

    ngOnInit() {
        this.modules = this.svgModuleProvider.getSvgModules();
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

}
