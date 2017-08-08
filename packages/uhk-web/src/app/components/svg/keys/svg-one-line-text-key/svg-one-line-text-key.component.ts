import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'g[svg-one-line-text-key]',
    templateUrl: './svg-one-line-text-key.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SvgOneLineTextKeyComponent implements OnInit {
    @Input() height: number;
    @Input() width: number;
    @Input() text: string;

    textY: number;
    spanX: number;

    constructor() { }

    ngOnInit() {
        this.textY = this.height / 2;
        this.spanX = this.width / 2;
    }
}
