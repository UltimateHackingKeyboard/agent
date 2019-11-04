import { animate, trigger, transition, style } from '@angular/animations';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'highlight-arrow',
    templateUrl: './highlight-arrow.component.html',
    styleUrls: ['./highlight-arrow.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        trigger('highlightProgressButton', [
            transition(':enter', [
                style({ transform: 'translateY(-50rem) scale(4)', opacity: 0 }),
                animate('500ms ease-in', style({ transform: 'translateY(-25rem) scale(2)', opacity: 1 })),
                animate('1000ms ease-out', style({ transform: 'translateY(0) scale(1)', opacity: 0 }))
            ])
        ])
    ]
})
export class HighlightArrowComponent {
}
