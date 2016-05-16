import { Component, OnInit, Input } from '@angular/core';

import {MapperService} from '../../services/mapper.service';

@Component({
    moduleId: module.id,
    selector: 'g[svg-switch-keymap-key]',
    template:
    `
        <svg:use [attr.xlink:href]="icon"
                [attr.width]="width / 4"
                [attr.height]="height / 4"
                [attr.x]="width * 3 / 8"
                [attr.y]="height / 5">
        </svg:use>
        <svg:text
            [attr.x]="0"
            [attr.y]="height * 2 / 3"
            [attr.text-anchor]="'middle'">
                <tspan [attr.x]="width / 2">{{ abbreviation }}</tspan>
        </svg:text>
    `
})
export class SvgSwitchKeymapKeyComponent implements OnInit {
    @Input() width: number;
    @Input() height: number;
    @Input() abbreviation: string;
    private icon: string;

    constructor(private mapperService: MapperService) { }

    ngOnInit() {
        this.icon = this.mapperService.getIcon('switch-keymap');
    }

}
