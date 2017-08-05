import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'g[svg-two-line-text-key]',
    templateUrl: './svg-two-line-text-key.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SvgTwoLineTextKeyComponent implements OnInit {
    @Input() height: number;
    @Input() width: number;
    @Input() texts: string[];

    textY: number;
    spanX: number;
    spanYs: number[];

    constructor() {
        this.spanYs = [];
    }

    ngOnInit() {
        this.textY = this.height / 2;
        this.spanX = this.width / 2;
        for (let i = 0; i < this.texts.length; ++i) {
            this.spanYs.push((0.75 - i * 0.5) * this.height);
        }
    }
}
