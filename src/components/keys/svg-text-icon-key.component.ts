import { Component, OnInit, Input } from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'g[svg-text-icon-key]',
    template:
    `
         <svg:text
            [attr.x]="0"
            [attr.y]="width > 2*height? height / 2 : height / 3"
            [attr.text-anchor]="width > 2*height ? 'end' : 'middle'"
            [attr.font-size]="19"
            [attr.font-family]="'Helvetica'"
            [attr.fill]="'#ffffff'"
            style="dominant-baseline: central">
                <tspan [attr.x]="width > 2*height ?0.6*width : width / 2">{{ text }}</tspan>
         </svg:text>
        <svg:use [attr.xlink:href]="icon"
                [attr.width]="width / 3"
                [attr.height]="height / 3"
                [attr.x]="width > 2*height ? width * 0.6 : width / 3"
                [attr.y]="width > 2*height ? height / 3 : height / 2"
                fill="white">
        </svg:use>
    `
})
export class SvgTextIconKeyComponent implements OnInit {
    @Input() width: number;
    @Input() height: number;
    @Input() text: string;
    @Input() icon: string;

    constructor() { }

    ngOnInit() {
        console.log(this);
    }

}
