import { Component, Input, OnChanges, ChangeDetectionStrategy, inject } from '@angular/core';

import { MapperService } from '../../../../services/mapper.service';

@Component({
    selector: 'g[svg-mouse-scroll-key]',
    standalone: false,
    templateUrl: './svg-mouse-scroll-key.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SvgMouseScrollKeyComponent implements OnChanges {
    @Input() direction: string;

    mouseIcon: string;
    directionIcon: string;

    private readonly mapper = inject(MapperService);

    ngOnChanges() {
        this.mouseIcon = this.mapper.getIcon('mouse');
        this.directionIcon = this.mapper.getIcon(`scroll-${this.direction}`);
    }
}
