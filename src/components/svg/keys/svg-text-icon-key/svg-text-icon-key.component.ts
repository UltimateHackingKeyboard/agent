import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'g[svg-text-icon-key]',
    template: require('./svg-text-icon-key.component.html')
})
export class SvgTextIconKeyComponent implements OnInit {
    @Input() width: number;
    @Input() height: number;
    @Input() text: string;
    @Input() icon: string;

    private useWidth: number;
    private useHeight: number;
    private useX: number;
    private useY: number;
    private textY: number;
    private textAnchor: string;
    private spanX: number;

    constructor() { }

    ngOnInit() {
        this.useWidth = this.width / 3;
        this.useHeight = this.height / 3;
        this.useX = (this.width > 2 * this.height) ? this.width * 0.6 : this.width / 3;
        this.useY = (this.width > 2 * this.height) ? this.height / 3 : this.height / 2;
        this.textY = (this.width > 2 * this.height) ? this.height / 2 : this.height / 3;
        this.textAnchor = (this.width > 2 * this.height) ? 'end' : 'middle';
        this.spanX = (this.width > 2 * this.height) ? 0.6 * this.width : this.width / 2;
    }
}
