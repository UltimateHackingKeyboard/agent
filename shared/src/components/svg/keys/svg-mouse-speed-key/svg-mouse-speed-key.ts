import { Component, Input, OnChanges } from '@angular/core';

import { MapperService } from '../../../../services/mapper.service';

@Component({
    selector: 'g[svg-mouse-speed-key]',
    templateUrl: './svg-mouse-speed-key.html'
})
export class SvgMouseSpeedKeyComponent implements OnChanges {
    @Input() plus: boolean;

    private icon: string;
    private sign: string;

    constructor(private mapper: MapperService) {
        this.icon = this.mapper.getIcon('mouse');
    }

    ngOnChanges() {
        this.sign = this.plus ? '+' : '-';
    }
}
