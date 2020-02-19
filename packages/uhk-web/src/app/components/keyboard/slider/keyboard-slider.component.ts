import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { HalvesInfo, Layer } from 'uhk-common';

import { KeyboardLayout } from '../../../keyboard/keyboard-layout.enum';
import {
    SvgKeyboardCaptureEvent,
    SvgKeyboardKeyClickEvent,
    SvgKeyHoverEvent
} from '../../../models/svg-key-events';
import { LastEditedKey } from '../../../models';

type AnimationKeyboard =
    'init' |
    'initOut' |
    'leftIn' |
    'leftOut' |
    'rightIn' |
    'rightOut';

@Component({
    selector: 'keyboard-slider',
    templateUrl: './keyboard-slider.component.html',
    styleUrls: ['./keyboard-slider.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    // We use 101%, because there was still a trace of the keyboard in the screen when animation was done
    animations: [
        trigger('layerState', [
            state('init', style({
                transform: 'translateX(-50%)',
                left: '50%'
            })),
            state('initOut', style({
                transform: 'translateX(0)',
                left: '101%'
            })),
            state('leftIn, rightIn', style({
                transform: 'translateX(-50%)',
                left: '50%'
            })),
            state('leftOut', style({
                transform: 'translateX(-101%)',
                left: '0'
            })),
            state('rightOut', style({
                transform: 'translateX(0)',
                left: '101%'
            })),
            transition('initOut => leftIn, leftOut => leftIn, rightOut => leftIn', [
                animate('{{animationTime}} ease-out', keyframes([
                    style({transform: 'translateX(0%)', left: '101%', offset: 0}),
                    style({transform: 'translateX(-50%)', left: '50%', offset: 1})
                ]))
            ], { params: { animationTime: '400ms' } }),
            transition('init => leftOut, leftIn => leftOut, rightIn => leftOut', [
                animate('{{animationTime}} ease-out', keyframes([
                    style({transform: 'translateX(-50%)', left: '50%', offset: 0}),
                    style({transform: 'translateX(-101%)', left: '0%', offset: 1})
                ]))
            ], { params: { animationTime: '400ms' } }),
            transition('* => rightIn', [
                animate('{{animationTime}} ease-out', keyframes([
                    style({transform: 'translateX(-101%)', left: '0%', offset: 0}),
                    style({transform: 'translateX(-50%)', left: '50%', offset: 1})
                ]))
            ], { params: { animationTime: '400ms' } }),
            transition('* => rightOut', [
                animate('{{animationTime}} ease-out', keyframes([
                    style({transform: 'translateX(-50%)', left: '50%', offset: 0}),
                    style({transform: 'translateX(0%)', left: '101%', offset: 1})
                ]))
            ], { params: { animationTime: '400ms' } }),
            transition(':leave', [
                animate('2000ms ease-out', keyframes([
                    style({opacity: 1, offset: 0}),
                    style({opacity: 0, offset: 1})
                ]))
            ])
        ])
    ]
})
export class KeyboardSliderComponent implements OnChanges {
    @Input() layers: Layer[];
    @Input() currentLayer: number;
    @Input() capturingEnabled: boolean;
    @Input() halvesInfo: HalvesInfo;
    @Input() selectedKey: { layerId: number, moduleId: number, keyId: number };
    @Input() keyboardLayout = KeyboardLayout.ANSI;
    @Input() description: string;
    @Input() lastEditedKey: LastEditedKey;
    @Input() animationEnabled: boolean;
    @Output() keyClick = new EventEmitter<SvgKeyboardKeyClickEvent>();
    @Output() keyHover = new EventEmitter<SvgKeyHoverEvent>();
    @Output() capture = new EventEmitter<SvgKeyboardCaptureEvent>();
    @Output() descriptionChanged = new EventEmitter<string>();

    layerAnimationState: AnimationKeyboard[];

    ngOnChanges(changes: SimpleChanges) {
        if (changes['layers']) {
            this.layerAnimationState = this.layers.map<AnimationKeyboard>(() => 'initOut');
            this.layerAnimationState[this.currentLayer] = 'init';
        }
        const layerChange = changes['currentLayer'];
        if (layerChange) {
            // turn off the routing navigation from non keymap route
            if (changes['layers']) {
            }
            else {
                const prevValue = layerChange.isFirstChange() ? layerChange.currentValue : layerChange.previousValue;
                this.onLayerChange(prevValue, layerChange.currentValue);
            }
        }
    }

    trackKeyboard(index: number) {
        return index;
    }

    onLayerChange(oldIndex: number, index: number): void {
        if (index > oldIndex) {
            this.layerAnimationState[oldIndex] = 'leftOut';
            this.layerAnimationState[index] = 'leftIn';
        } else {
            this.layerAnimationState[oldIndex] = 'rightOut';
            this.layerAnimationState[index] = 'rightIn';
        }
    }

    get animationTime(): string {
        return this.animationEnabled ? '400ms' : '0ms';
    }
}
