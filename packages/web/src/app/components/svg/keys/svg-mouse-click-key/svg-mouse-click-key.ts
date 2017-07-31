import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { MapperService } from '../../../../services/mapper.service';

@Component({
    selector: 'g[svg-mouse-click-key]',
    templateUrl: './svg-mouse-click-key.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SvgMouseClickKeyComponent implements OnInit {
    @Input() button: string;

    private icon: string;

    constructor(private mapper: MapperService) {
        this.icon = this.mapper.getIcon('mouse');
    }

    ngOnInit() { }
}
