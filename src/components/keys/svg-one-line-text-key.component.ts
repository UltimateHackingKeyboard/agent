import { Component, OnInit, Input } from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'g[svg-one-line-text-key]',
    template:
    `
         <svg:text
            [attr.x]="0"
            [attr.y]="height / 2"
            [attr.text-anchor]="'middle'">
                <tspan
                    [attr.x]="width / 2"
                    dy="0"
                    >{{ text }}</tspan>
         </svg:text>
    `
})
export class SvgOneLineTextKeyComponent implements OnInit {
    @Input() height: number;
    @Input() width: number;
    @Input() text: string;

    constructor() { }

    ngOnInit() { }

}
