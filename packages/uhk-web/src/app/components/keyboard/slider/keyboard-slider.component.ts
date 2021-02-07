import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { HalvesInfo, Layer } from 'uhk-common';

import { KeyboardLayout } from '../../../keyboard/keyboard-layout.enum';
import {
    SvgKeyboardCaptureEvent,
    SvgKeyboardKeyClickEvent,
    SvgKeyHoverEvent
} from '../../../models/svg-key-events';
import { LastEditedKey } from '../../../models';

interface LayerAnimationCssClasses {
    center?: boolean;
    leftToCenter?: boolean;
    leftToCenter2?: boolean;
    rightToCenter?: boolean;
    rightToCenter2?: boolean;
    centerToLeft?: boolean;
    centerToLeft2?: boolean;
    centerToRight?: boolean;
    centerToRight2?: boolean;
}

enum LayerNames {
    A,
    B
}

@Component({
    selector: 'keyboard-slider',
    templateUrl: './keyboard-slider.component.html',
    styleUrls: ['./keyboard-slider.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
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
    aLayerCssClasses: LayerAnimationCssClasses = {
        center: true
    };
    bLayerCssClasses: LayerAnimationCssClasses = {};
    visibleLayerName = LayerNames.A;

    ngOnChanges(changes: SimpleChanges) {
        if (changes['layers']) {
            if (!this.animationEnabled || this.visibleLayerName === LayerNames.A) {
                this.aLayer = this.layers[this.currentLayer];
            } else {
                this.bLayer = this.layers[this.currentLayer];
            }
        }

        const layerChange = changes['currentLayer'];
        if (layerChange) {
            if (!this.animationEnabled || layerChange.isFirstChange()) {
                this.aLayer = this.layers[this.currentLayer];
            } else if (this.visibleLayerName === LayerNames.A) {
                this.bLayer = this.layers[this.currentLayer];
                this.visibleLayerName = LayerNames.B;
                this.onLayerChange(layerChange.previousValue, layerChange.currentValue);
            } else {
                this.aLayer = this.layers[this.currentLayer];
                this.visibleLayerName = LayerNames.A;
                this.onLayerChange(layerChange.previousValue, layerChange.currentValue);
            }
        }
    }

    trackKeyboard(index: number) {
        return index;
    }

    onLayerChange(oldIndex: number, index: number): void {
        if (this.visibleLayerName === LayerNames.A) {
            if (oldIndex < index) {
                this.aLayerCssClasses = {
                    // center: true,
                    rightToCenter: !this.aLayerCssClasses.rightToCenter,
                    rightToCenter2: this.aLayerCssClasses.rightToCenter
                };

                this.bLayerCssClasses = {
                    centerToLeft: !this.bLayerCssClasses.centerToLeft,
                    centerToLeft2: this.bLayerCssClasses.centerToLeft
                };
            } else {
                this.aLayerCssClasses = {
                    // center: true,
                    leftToCenter: !this.aLayerCssClasses.leftToCenter,
                    leftToCenter2: this.aLayerCssClasses.leftToCenter
                };

                this.bLayerCssClasses = {
                    centerToRight: !this.bLayerCssClasses.centerToRight,
                    centerToRight2: this.bLayerCssClasses.centerToRight
                };
            }
        } else {
            if (oldIndex < index) {
                this.aLayerCssClasses = {
                    centerToLeft: !this.aLayerCssClasses.centerToLeft,
                    centerToLeft2: this.aLayerCssClasses.centerToLeft
                };

                this.bLayerCssClasses = {
                    // center: true,
                    rightToCenter: !this.bLayerCssClasses.rightToCenter,
                    rightToCenter2: this.bLayerCssClasses.rightToCenter
                };
            } else {
                this.aLayerCssClasses = {
                    centerToRight: !this.aLayerCssClasses.centerToRight,
                    centerToRight2: this.aLayerCssClasses.centerToRight
                };

                this.bLayerCssClasses = {
                    // center: true,
                    leftToCenter: !this.bLayerCssClasses.leftToCenter,
                    leftToCenter2: this.bLayerCssClasses.leftToCenter
                };
            }
        }
    }
}
