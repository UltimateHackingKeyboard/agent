import { Component, Input, OnInit } from '@angular/core';

import { MapperService } from '../../../../services/mapper.service';

@Component({
    selector: 'g[svg-switch-keymap-key]',
    template: require('./svg-switch-keymap-key.component.html')
})
export class SvgSwitchKeymapKeyComponent implements OnInit {
    @Input() width: number;
    @Input() height: number;
    @Input() abbreviation: string;

    private icon: string;
    private useWidth: number;
    private useHeight: number;
    private useX: number;
    private useY: number;
    private textY: number;
    private spanX: number;

    constructor(private mapperService: MapperService) { }

    ngOnInit() {
        this.icon = this.mapperService.getIcon('switch-keymap');

        this.useWidth = this.width / 4;
        this.useHeight = this.height / 4;
        this.useX = this.width * 3 / 8;
        this.useY = this.height / 5;
        this.textY = this.height * 2 / 3;
        this.spanX = this.width / 2;
    }
}
