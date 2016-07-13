import { Component, OnInit, Input } from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'g[svg-two-line-text-key]',
    template: require('./svg-two-line-text-key.component.html')
})
export class SvgTwoLineTextKeyComponent implements OnInit {
    @Input() height: number;
    @Input() width: number;
    @Input() texts: string[];

    private textY: number;
    private spanX: number;

    constructor() { }

    ngOnInit() {
        this.textY = this.height / 2;
        this.spanX = this.width / 2;
    }

    private spanY(index: number) {
        return (0.75 - index * 0.5) * this.height;
    }
}
