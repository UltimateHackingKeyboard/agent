import { Component, OnInit, Input } from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'g[svg-single-icon-key]',
    template:
    `
        <svg:use [attr.xlink:href]="icon"
                [attr.width]="width / 3" [attr.height]="height / 3"
                [attr.x]="width / 3" [attr.y]="height / 3">
        </svg:use>
    `
})
export class SvgSingleIconKeyComponent implements OnInit {
    @Input() width: number;
    @Input() height: number;
    @Input() icon: string;

    constructor() { }

    ngOnInit() { }

}
