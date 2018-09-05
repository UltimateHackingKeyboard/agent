import { Component, Input, ChangeDetectionStrategy, OnChanges, SimpleChanges } from '@angular/core';

import { isRectangleAsSecondaryRoleKey } from '../util';
import { SECONDARY_ROLE_BOTTOM_MARGIN } from '../../constants';

@Component({
    selector: 'g[svg-icon-text-key]',
    templateUrl: './svg-icon-text-key.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SvgIconTextKeyComponent implements OnChanges {
    @Input() width: number;
    @Input() height: number;
    @Input() icon: string;
    @Input() text: string;
    @Input() secondaryText: string;

    useWidth: number;
    useHeight: number;
    useX: number;
    useY: number;
    textY: number;
    spanX: number;
    secondaryTextY: number;
    secondaryHeight: number;

    constructor() {
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.calculatePositions();
    }

    private calculatePositions(): void {
        let textYModifier = 0;
        let secondaryYModifier = 0;

        if (this.secondaryText && isRectangleAsSecondaryRoleKey(this.width, this.height)) {
            textYModifier = this.height / 5;
            secondaryYModifier = 5;
        }

        this.useWidth = this.width / 3;
        this.useHeight = this.height / 3;
        this.useX = (this.width > 2 * this.height) ? 0 : this.width / 3;
        this.useY = (this.width > 2 * this.height) ? this.height / 3 : this.height / 10;
        this.textY = (this.width > 2 * this.height) ? this.height / 2 : this.height * 0.6;
        this.spanX = (this.width > 2 * this.height) ? this.width * 0.6 : this.width / 2;

        this.secondaryHeight = this.height / 4;
        this.secondaryTextY = this.height - this.secondaryHeight - SECONDARY_ROLE_BOTTOM_MARGIN - secondaryYModifier;
    }
}
