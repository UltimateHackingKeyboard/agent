import { Component, Input, OnChanges, ChangeDetectionStrategy, inject } from '@angular/core';

import { MapperService } from '../../../../services/mapper.service';

@Component({
    selector: 'g[svg-mouse-speed-key]',
    standalone: false,
    templateUrl: './svg-mouse-speed-key.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SvgMouseSpeedKeyComponent implements OnChanges {
    @Input() plus: boolean;

    icon: string;
    sign: string;

    private readonly mapper = inject(MapperService);

    constructor() {
        this.icon = this.mapper.getIcon('mouse');
    }

    ngOnChanges() {
        this.sign = this.plus ? '+' : '-';
    }
}
