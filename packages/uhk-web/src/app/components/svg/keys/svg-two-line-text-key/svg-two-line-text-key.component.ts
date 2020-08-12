import { Component, Input, ChangeDetectionStrategy, SimpleChanges, OnChanges } from '@angular/core';
import { SECONDARY_ROLE_BOTTOM_MARGIN } from '../../constants';
import { calculateFitFontSize, START_FONT_SIZE } from '../util';

@Component({
    selector: 'g[svg-two-line-text-key]',
    templateUrl: './svg-two-line-text-key.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SvgTwoLineTextKeyComponent implements OnChanges {
    @Input() height: number;
    @Input() width: number;
    @Input() texts: string[];
    @Input() secondaryText: string;

    fontSizes = [START_FONT_SIZE, START_FONT_SIZE];
    textY: number;
    spanX: number;
    spanYs: number[];
    secondaryTextY: number;
    secondaryHeight: number;

    constructor() {
        this.spanYs = [];
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.calculatePositions();
        this.fontSizes = [
            calculateFitFontSize(this.texts[0], this.width),
            calculateFitFontSize(this.texts[1], this.width)
        ];
    }

    calculatePositions(): void {
        let secondaryYModifier = 0;
        this.secondaryHeight = 0;
        let textContainerHeight = this.height;

        if (this.secondaryText) {
            secondaryYModifier = 0;
            this.secondaryHeight = this.height / 4;
            textContainerHeight -= this.secondaryHeight;
        }

        this.textY = textContainerHeight / 2;
        this.spanX = this.width / 2;
        this.spanYs = [];
        for (let i = 0; i < this.texts.length; ++i) {
            this.spanYs.push((0.85 - i * 0.5) * textContainerHeight);
        }

        this.secondaryTextY = this.height - this.secondaryHeight - SECONDARY_ROLE_BOTTOM_MARGIN - secondaryYModifier;
    }
}
