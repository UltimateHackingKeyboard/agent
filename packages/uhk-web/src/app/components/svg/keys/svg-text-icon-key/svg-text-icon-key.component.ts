import { Component, Input, ChangeDetectionStrategy, OnChanges, SimpleChanges } from '@angular/core';

import { isRectangleAsSecondaryRoleKey } from '../util';
import { SECONDARY_ROLE_BOTTOM_MARGIN } from '../../constants';

@Component({
    selector: 'g[svg-text-icon-key]',
    templateUrl: './svg-text-icon-key.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SvgTextIconKeyComponent implements OnChanges {
    @Input() width: number;
    @Input() height: number;
    @Input() text: string;
    @Input() icon: string;
    @Input() secondaryText: string;

    useWidth: number;
    useHeight: number;
    useX: number;
    useY: number;
    textY: number;
    textAnchor: string;
    spanX: number;
    secondaryTextY: number;
    secondaryHeight: number;

    constructor() {}

    ngOnChanges(changes: SimpleChanges): void {
        this.calculatePositions();
    }

    calculatePositions(): void {
        let textYModifier = 0;
        let secondaryYModifier = 0;

        if (this.secondaryText && isRectangleAsSecondaryRoleKey(this.width, this.height)) {
            textYModifier = this.height / 5;
            secondaryYModifier = 5;
        }

        this.useWidth = this.width / 3;
        this.useHeight = this.height / 3;
        this.useX = this.width > 2 * this.height ? this.width * 0.6 : this.width / 3;
        this.useY = this.width > 2 * this.height ? this.height / 3 : this.height / 2;
        this.textY = (this.width > 2 * this.height ? this.height / 2 : this.height / 3) - textYModifier;
        this.textAnchor = this.width > 2 * this.height ? 'end' : 'middle';
        this.spanX = this.width > 2 * this.height ? 0.6 * this.width : this.width / 2;

        this.secondaryHeight = this.height / 4;
        this.secondaryTextY = this.height - this.secondaryHeight - SECONDARY_ROLE_BOTTOM_MARGIN - secondaryYModifier;
    }
}
