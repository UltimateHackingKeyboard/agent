import { Component, Input, ChangeDetectionStrategy, OnChanges, SimpleChanges } from '@angular/core';

import { calculateFitFontSize, isRectangleAsSecondaryRoleKey, START_FONT_SIZE } from '../util';
import { SECONDARY_ROLE_BOTTOM_MARGIN } from '../../constants';

@Component({
    selector: 'g[svg-text-icon-key]',
    templateUrl: './svg-text-icon-key.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SvgTextIconKeyComponent implements OnChanges {
    @Input() width: number;
    @Input() height: number;
    @Input() text: string;
    @Input() icon: string;
    @Input() secondaryText: string;
    @Input() textColor: string;

    fontSize = START_FONT_SIZE;
    useWidth: number;
    useHeight: number;
    useX: number;
    useY: number;
    textY: number;
    textAnchor: string;
    textX: number;
    secondaryTextY: number;
    secondaryHeight: number;

    constructor() { }

    ngOnChanges(changes: SimpleChanges): void {
        this.calculatePositions();
        this.fontSize = calculateFitFontSize(this.text, this.width);
    }

    calculatePositions(): void {
        let textYModifier = 0;
        let useYModifier = 0;
        let secondaryYModifier = 0;

        if (this.secondaryText) {
            if (isRectangleAsSecondaryRoleKey(this.width, this.height)) {
                textYModifier = this.height / 5;
                secondaryYModifier = 5;
            } else {
                textYModifier = this.height / 5 - 5;
                useYModifier = textYModifier;
            }
        }

        this.useWidth = this.width / 3;
        this.useHeight = this.height / 3;
        this.useX = (this.width > 2 * this.height) ? this.width * 0.6 : this.width / 3;
        this.useY = (this.width > 2 * this.height) ? this.height / 3 : this.height / 2 - useYModifier;
        this.textY = ((this.width > 2 * this.height) ? this.height / 2 : this.height / 3) - textYModifier;
        this.textAnchor = (this.width > 2 * this.height) ? 'end' : 'middle';
        this.textX = (this.width > 2 * this.height) ? 0.6 * this.width : this.width / 2;

        this.secondaryHeight = this.height / 4;
        this.secondaryTextY = this.height - this.secondaryHeight - SECONDARY_ROLE_BOTTOM_MARGIN - secondaryYModifier;
    }
}
