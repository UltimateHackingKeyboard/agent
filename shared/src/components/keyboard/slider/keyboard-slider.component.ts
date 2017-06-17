import {
    Component, ChangeDetectionStrategy, Input, Output, EventEmitter, OnChanges, SimpleChanges
} from '@angular/core';
import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';

import { Layer } from '../../../config-serializer/config-items/Layer';

type AnimationKeyboard =
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
            transition('leftOut => leftIn, rightOut => leftIn', [
                animate('400ms ease-out', keyframes([
                    style({ transform: 'translateX(0%)', left: '101%', offset: 0 }),
                    style({ transform: 'translateX(-50%)', left: '50%', offset: 1 })
                ]))
            ]),
            transition('leftIn => leftOut, rightIn => leftOut', [
                animate('400ms ease-out', keyframes([
                    style({ transform: 'translateX(-50%)', left: '50%', offset: 0 }),
                    style({ transform: 'translateX(-101%)', left: '0%', offset: 1 })
                ]))
            ]),
            transition('* => rightIn', [
                animate('400ms ease-out', keyframes([
                    style({ transform: 'translateX(-101%)', left: '0%', offset: 0 }),
                    style({ transform: 'translateX(-50%)', left: '50%', offset: 1 })
                ]))
            ]),
            transition('* => rightOut', [
                animate('400ms ease-out', keyframes([
                    style({ transform: 'translateX(-50%)', left: '50%', offset: 0 }),
                    style({ transform: 'translateX(0%)', left: '101%', offset: 1 })
                ]))
            ]),
            transition(':leave', [
                animate('2000ms ease-out', keyframes([
                    style({ opacity: 1, offset: 0 }),
                    style({ opacity: 0, offset: 1 })
                ]))
            ])
        ])
    ]
})
export class KeyboardSliderComponent implements OnChanges {
    @Input() layers: Layer[];
    @Input() currentLayer: number;
    @Input() keybindAnimationEnabled: boolean;
    @Input() capturingEnabled: boolean;
    @Input() selectedKey: { layerId: number, moduleId: number, keyId: number };
    @Output() keyClick = new EventEmitter();
    @Output() keyHover = new EventEmitter();
    @Output() capture = new EventEmitter();

    private layerAnimationState: AnimationKeyboard[];

    ngOnChanges(changes: SimpleChanges) {
        if (changes['layers']) {
            this.layerAnimationState = this.layers.map<AnimationKeyboard>(() => 'leftOut');
            this.layerAnimationState[this.currentLayer] = 'leftIn';
        }
        const layerChange = changes['currentLayer'];
        if (layerChange) {
            const prevValue = layerChange.isFirstChange() ? layerChange.currentValue : layerChange.previousValue;
            this.onLayerChange(prevValue, layerChange.currentValue);
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

}
