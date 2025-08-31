import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'highlight-arrow',
    standalone: false,
    templateUrl: './highlight-arrow.component.html',
    styleUrls: ['./highlight-arrow.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HighlightArrowComponent {
}
