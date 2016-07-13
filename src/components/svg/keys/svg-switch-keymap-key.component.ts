import { Component, OnInit, Input } from '@angular/core';

import {MapperService} from '../../../services/mapper.service';

@Component({
    moduleId: module.id,
    selector: 'g[svg-switch-keymap-key]',
    template: require('./svg-switch-keymap-key.component.html')
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
