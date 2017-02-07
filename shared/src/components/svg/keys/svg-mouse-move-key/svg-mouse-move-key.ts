import { Component, Input, OnChanges, ChangeDetectionStrategy } from '@angular/core';

import { MapperService } from '../../../../services/mapper.service';

@Component({
    selector: 'g[svg-mouse-move-key]',
    templateUrl: './svg-mouse-move-key.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SvgMouseMoveKeyComponent implements OnChanges {
    @Input() direction: string;

    private mouseIcon: string;
    private directionIcon: string;

    constructor(private mapper: MapperService) { }

    ngOnChanges() {
        this.mouseIcon = this.mapper.getIcon('mouse');
        this.directionIcon = this.mapper.getIcon(`${this.direction}-arrow`);
    }
}
