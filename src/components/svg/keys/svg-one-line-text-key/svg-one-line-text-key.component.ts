import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'g[svg-one-line-text-key]',
    template: require('./svg-one-line-text-key.component.html')
})
export class SvgOneLineTextKeyComponent implements OnInit {
    @Input() height: number;
    @Input() width: number;
    @Input() text: string;

    private textY: number;
    private spanX: number;

    constructor() { }

    ngOnInit() {
        this.textY = this.height / 2;
        this.spanX = this.width / 2;
    }
}
