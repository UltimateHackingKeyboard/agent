import {
    ChangeDetectionStrategy,
    Component,
    Input,
    OnChanges,
    OnInit,
    SimpleChanges
} from '@angular/core';

import { getContentWidth } from '../../../../util';

const SECONDARY_STYLE: CSSStyleDeclaration = {
    font: '12px Helvetica'
} as any;

@Component({
    selector: 'g[svg-secondary-role]',
    templateUrl: './svg-secondary-role.component.html',
    styleUrls: ['./svg-secondary-role.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SvgSecondaryRoleComponent implements OnInit, OnChanges {
    @Input() height: number;
    @Input() width: number;
    @Input() y: number;
    @Input() text: string;

    viewBox: string;
    textY: number;
    transform: string;
    textIndent = 16;

    ngOnInit(): void {
        this.viewBox = [0, 0, this.width, this.height].join(' ');
        this.textY = this.height / 2 - 2;
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.text) {
            this.calculateTextPosition();
        }
    }

    private calculateTextPosition(): void {
        const textWidth = getContentWidth(SECONDARY_STYLE, this.text) + this.textIndent;
        const translateValue = Math.max(0, (this.width - textWidth) / 2);
        this.transform = `translate(${ translateValue },0)`;
    }
}
