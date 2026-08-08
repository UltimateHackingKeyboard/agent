import { Component, Input, OnChanges, ChangeDetectionStrategy, inject } from '@angular/core';

import { MapperService } from '../../../../services/mapper.service';

@Component({
    selector: 'g[svg-mouse-move-key]',
    standalone: false,
    templateUrl: './svg-mouse-move-key.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SvgMouseMoveKeyComponent implements OnChanges {
    @Input() direction: string;

    mouseIcon: string;
    directionIcon: string;

    private readonly mapper = inject(MapperService);

    ngOnChanges() {
        this.mouseIcon = this.mapper.getIcon('mouse');
        this.directionIcon = this.mapper.getIcon(`${this.direction}-arrow`);
    }
}
