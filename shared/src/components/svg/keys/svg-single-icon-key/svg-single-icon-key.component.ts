import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'g[svg-single-icon-key]',
    templateUrl: './svg-single-icon-key.component.html'
})
export class SvgSingleIconKeyComponent implements OnInit {
    @Input() width: number;
    @Input() height: number;
    @Input() icon: string;

    private svgHeight: number;
    private svgWidth: number;

    constructor() { }

    ngOnInit() {
        this.svgWidth = this.width / 3;
        this.svgHeight = this.height / 3;
    }
}
