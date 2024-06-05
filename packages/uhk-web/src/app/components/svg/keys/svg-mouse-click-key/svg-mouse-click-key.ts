import { Component, Input, ChangeDetectionStrategy, OnChanges, SimpleChanges } from '@angular/core';

import { MapperService } from '../../../../services/mapper.service';
import { getContentWidth } from '../../../../util/index';

const MAX_FONT_SIZE = 25;
const MIN_FONT_SIZE = 20;

@Component({
    selector: 'g[svg-mouse-click-key]',
    templateUrl: './svg-mouse-click-key.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SvgMouseClickKeyComponent implements OnChanges {
    @Input() button: string;

    fontSize = MAX_FONT_SIZE;
    icon: string;

    constructor(private mapper: MapperService) {
        this.icon = this.mapper.getIcon('mouse');
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.button) {
            this.calculateFontSize();
        }
    }

    private calculateFontSize() {
        this.fontSize = MAX_FONT_SIZE;

        if (!this.button) {
            return;
        }

        // the svg element uses 100 x 100 viewBox, so we can hardcode the 96 because it is 100 - 2px left and 2 px right padding.
        const reducedWidth = 96;

        for (let fontSize = MAX_FONT_SIZE; fontSize >= MIN_FONT_SIZE; fontSize = fontSize - 0.5) {
            const style = {
                font: `${fontSize}px Helvetica`
            } as CSSStyleDeclaration;

            const calculatedWidth = getContentWidth(style, this.button);

            if (calculatedWidth <= reducedWidth) {
                this.fontSize = fontSize;
                return;
            }
        }

        this.fontSize = MIN_FONT_SIZE;
    }
}
