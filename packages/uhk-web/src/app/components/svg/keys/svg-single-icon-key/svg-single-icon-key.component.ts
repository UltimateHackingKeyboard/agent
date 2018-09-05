import { Component, Input, ChangeDetectionStrategy, OnChanges, SimpleChanges } from '@angular/core';

import { isRectangleAsSecondaryRoleKey } from '../util';
import { SECONDARY_ROLE_BOTTOM_MARGIN } from '../../constants';

@Component({
    selector: 'g[svg-single-icon-key]',
    templateUrl: './svg-single-icon-key.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SvgSingleIconKeyComponent implements OnChanges {
    @Input() width: number;
    @Input() height: number;
    @Input() icon: string;
    @Input() secondaryText: string;

    svgHeight: number;
    svgWidth: number;
    secondaryTextY: number;
    secondaryHeight: number;

    constructor() { }

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

        this.svgWidth = this.width / 3;
        this.svgHeight = this.height / 3;
        this.secondaryHeight = this.height / 4;
        this.secondaryTextY = this.height - this.secondaryHeight - SECONDARY_ROLE_BOTTOM_MARGIN - secondaryYModifier;
    }
}
