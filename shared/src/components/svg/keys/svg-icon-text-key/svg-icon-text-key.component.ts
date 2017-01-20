import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'g[svg-icon-text-key]',
    template: require('./svg-icon-text-key.component.html')
})
export class SvgIconTextKeyComponent implements OnInit {
    @Input() width: number;
    @Input() height: number;
    @Input() icon: string;
    @Input() text: string;

    private useWidth: number;
    private useHeight: number;
    private useX: number;
    private useY: number;
    private textY: number;
    private spanX: number;

    constructor() {
    }

    ngOnInit() {
        this.useWidth = this.width / 3;
        this.useHeight = this.height / 3;
        this.useX = (this.width > 2 * this.height) ? 0 : this.width / 3;
        this.useY = (this.width > 2 * this.height) ? this.height / 3 : this.height / 10;
        this.textY = (this.width > 2 * this.height) ? this.height / 2 : this.height * 0.6;
        this.spanX = (this.width > 2 * this.height) ? this.width * 0.6 : this.width / 2;
    }
}
