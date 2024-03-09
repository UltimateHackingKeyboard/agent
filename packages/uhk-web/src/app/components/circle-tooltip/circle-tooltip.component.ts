import { HostBinding } from '@angular/core';
import { Component, Input, TemplateRef } from '@angular/core';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { PlacementArray } from '@ng-bootstrap/ng-bootstrap/util/positioning';

@Component({
    selector: 'circle-tooltip',
    templateUrl: './circle-tooltip.component.html',
})
export default class CircleTooltipComponent {
    @Input() placement: PlacementArray = ['bottom', 'top'];
    @Input() tooltip: string | TemplateRef<any> | null | undefined;
    @Input() width: number | null | undefined;

    readonly faQuestionCircle = faQuestionCircle;

    @HostBinding('style.--tooltip-max-width')
    get getSanitizedStyle(): string {
        return this.width ? `${this.width}px` : null;
    }
}
