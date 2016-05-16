import { Component, OnInit, Input } from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'g[svg-two-line-text-key]',
    template:
    `
         <svg:text
            [attr.x]="0"
            [attr.y]="height/2"
            [attr.text-anchor]="'middle'">
                 <tspan
                        *ngFor="let text of texts; let index = index"
                        [attr.x]="width / 2"
                        [attr.y]="(0.75 - index * 0.5) * height"
                        dy="0"
                        >{{ text }}</tspan>
         </svg:text>
    `
})
export class SvgTwoLineTextKeyComponent implements OnInit {
    @Input() height: number;
    @Input() width: number;
    @Input() texts: string[];

    constructor() { }

    ngOnInit() { }

}
