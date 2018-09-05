import { Component, Input, ChangeDetectionStrategy, OnChanges, SimpleChanges } from '@angular/core';

import { isRectangleAsSecondaryRoleKey } from '../util';
import { SECONDARY_ROLE_BOTTOM_MARGIN } from '../../constants';

@Component({
    selector: 'g[svg-one-line-text-key]',
    templateUrl: './svg-one-line-text-key.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SvgOneLineTextKeyComponent implements OnChanges {
    @Input() height: number;
    @Input() width: number;
    @Input() text: string;
    @Input() secondaryText: string;

    textY: number;
    spanX: number;
    secondaryTextY: number;
    secondaryHeight: number;

    constructor() { }

    ngOnChanges(changes: SimpleChanges): void {
        this.calculatePositions();
    }

    calculatePositions() {
        let textYModifier = 0;
        let secondaryYModifier = 0;

        if (this.secondaryText && isRectangleAsSecondaryRoleKey(this.width, this.height)) {
            textYModifier = this.height / 5;
            secondaryYModifier = 5;
        }

        this.textY = this.height / 2 - textYModifier;
        this.spanX = this.width / 2;

        this.secondaryHeight = this.height / 4;
        this.secondaryTextY = this.height - this.secondaryHeight - SECONDARY_ROLE_BOTTOM_MARGIN - secondaryYModifier;
    }
}
