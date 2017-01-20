import { Component, Input, OnChanges } from '@angular/core';

import { MapperService } from '../../../../services/mapper.service';

@Component({
    selector: 'g[svg-mouse-scroll-key]',
    template: require('./svg-mouse-scroll-key.html')
})
export class SvgMouseScrollKeyComponent implements OnChanges {
    @Input() direction: string;

    private mouseIcon: string;
    private directionIcon: string;

    constructor(private mapper: MapperService) { }

    ngOnChanges() {
        this.mouseIcon = this.mapper.getIcon('mouse');
        this.directionIcon = this.mapper.getIcon(`scroll-${this.direction}`);
    }
}
