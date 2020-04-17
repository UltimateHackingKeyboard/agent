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
    'center' |
    'centerToLeft' |
    'centerToLeft2' |
    'centerToRight' |
    'centerToRight2' |
    'leftToCenter' |
    'leftToCenter2' |
    'rightToCenter' |
    'rightToCenter2'
    ;

enum LayerNames {
    A,
    B
}

@Component({
    selector: 'keyboard-slider',
    templateUrl: './keyboard-slider.component.html',
    styleUrls: ['./keyboard-slider.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    // We use 101%, because there was still a trace of the keyboard in the screen when animation was done
    animations: [
        trigger('layerState', [
            state('center, leftToCenter, leftToCenter2, rightToCenter, rightToCenter2', style({
                transform: 'translateX(-50%)',
                left: '50%'
            })),
            state('centerToLeft, centerToLeft2', style({
                transform: 'translateX(-101%)',
                left: '0'
            })),
            state('centerToRight, centerToRight2', style({
                transform: 'translateX(0)',
                left: '101%'
            })),
            transition('* => centerToLeft, * => centerToLeft2', [
                animate('{{animationTime}} ease-out', keyframes([
                    style({transform: 'translateX(-50%)', left: '50%', offset: 0}),
                    style({transform: 'translateX(-101%)', left: '0', offset: 1})
                ]))
            ], { params: { animationTime: '400ms' } }),
            transition('* => centerToRight, * => centerToRight2', [
                animate('{{animationTime}} ease-out', keyframes([
                    style({transform: 'translateX(-50%)', left: '50%', offset: 0}),
                    style({transform: 'translateX(0%)', left: '101%', offset: 1})
                ]))
            ], { params: { animationTime: '400ms' } }),
            transition('* => leftToCenter, * => leftToCenter2', [
                animate('{{animationTime}} ease-out', keyframes([
                    style({transform: 'translateX(-101%)', left: 0, offset: 0}),
                    style({transform: 'translateX(-50%)', left: '50%', offset: 1})
                ]))
            ], { params: { animationTime: '400ms' } }),
            transition('* => rightToCenter, * => rightToCenter2', [
                animate('{{animationTime}} ease-out', keyframes([
                    style({transform: 'translateX(0)', left: '101%', offset: 0}),
                    style({transform: 'translateX(-50%)', left: '50%', offset: 1})
                ]))
            ], { params: { animationTime: '400ms' } }),
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

    aLayer: Layer;
    bLayer: Layer;
    aLayerAnimationState: AnimationKeyboard = 'center';
    bLayerAnimationState: AnimationKeyboard = 'centerToRight';
    visibleLayerName = LayerNames.A;

    ngOnChanges(changes: SimpleChanges) {
        if (changes['layers']) {
            if (this.visibleLayerName === LayerNames.A) {
                this.aLayer = this.layers[this.currentLayer];
            } else{
                this.bLayer = this.layers[this.currentLayer];
            }
        }

        const layerChange = changes['currentLayer'];
        if (layerChange) {
            if (layerChange.isFirstChange()) {
                this.aLayer = this.layers[this.currentLayer];
            } else if (this.visibleLayerName === LayerNames.A) {
                this.bLayer = this.layers[this.currentLayer];
                this.onLayerChange(layerChange.previousValue, layerChange.currentValue);
                this.visibleLayerName = LayerNames.B;
            } else {
                this.aLayer = this.layers[this.currentLayer];
                this.onLayerChange(layerChange.previousValue, layerChange.currentValue);
                this.visibleLayerName = LayerNames.A;
            }
        }
    }

    trackKeyboard(index: number) {
        return index;
    }

    onLayerChange(oldIndex: number, index: number): void {
        if(oldIndex < index) {
            this.aLayerAnimationState = this.aLayerAnimationState === 'centerToLeft' ? 'centerToLeft2' : 'centerToLeft';
            this.bLayerAnimationState = this.bLayerAnimationState === 'rightToCenter' ? 'rightToCenter2' : 'rightToCenter';
        } else {
            this.aLayerAnimationState = this.aLayerAnimationState === 'leftToCenter' ? 'leftToCenter2' : 'leftToCenter';
            this.bLayerAnimationState = this.bLayerAnimationState === 'centerToRight' ? 'centerToRight2' : 'centerToRight';
        }
    }

    get animationTime(): string {
        return this.animationEnabled ? '400ms' : '0ms';
    }
}
