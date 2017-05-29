import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';

import { KeyAction } from '../../../config-serializer/config-items/key-action';

import { SvgKeyboardKey } from '../keys';

@Component({
    selector: 'g[svg-module]',
    templateUrl: './svg-module.component.html',
    styleUrls: ['./svg-module.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SvgModuleComponent {
    @Input() coverages: any[];
    @Input() keyboardKeys: SvgKeyboardKey[];
    @Input() keyActions: KeyAction[];
    @Input() selectedKey: { layerId: number, moduleId: number, keyId: number };
    @Input() selected: boolean;
    @Input() keybindAnimationEnabled: boolean;
    @Input() capturingEnabled: boolean;
    @Output() keyClick = new EventEmitter();
    @Output() keyHover = new EventEmitter();
    @Output() capture = new EventEmitter();

    constructor() {
        this.keyboardKeys = [];
    }

    onKeyClick(index: number, keyTarget: HTMLElement): void {
        this.keyClick.emit({
            index,
            keyTarget
        });
    }

    onKeyHover(index: number, event: MouseEvent, over: boolean): void {
        this.keyHover.emit({
            index,
            event,
            over
        });
    }

    onCapture(index: number, captured: {code: number, left: boolean[], right: boolean[]}) {
        this.capture.emit({
            index,
            captured
        });
    }
}
