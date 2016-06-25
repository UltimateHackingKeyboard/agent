import { Component, OnInit, Input } from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'g[svg-icon-text-key]',
    template:
    `
        <svg:use [attr.xlink:href]="icon"
                [attr.width]="width / 3"
                [attr.height]="height / 3"
                [attr.x]="width > 2*height ? 0 : width / 3"
                [attr.y]="width > 2*height ? height / 3 : height / 10">
        </svg:use>
        <svg:text
            [attr.x]="0"
            [attr.y]="width > 2*height? height / 2 : height * 0.6"
            [attr.text-anchor]="'middle'"
            [attr.font-size]="11">
                <tspan [attr.x]="width > 2*height ? width * 0.6 : width / 2">{{ text }}</tspan>
        </svg:text>
    `
})
export class SvgIconTextKeyComponent implements OnInit {
    @Input() width: number;
    @Input() height: number;
    @Input() icon: string;
    @Input() text: string;

    constructor() { }

    ngOnInit() { }

}
