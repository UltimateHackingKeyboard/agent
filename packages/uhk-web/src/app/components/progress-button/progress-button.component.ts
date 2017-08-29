import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
    selector: 'progress-button',
    templateUrl: './progress-button.component.html',
    styleUrls: ['./progress-button.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProgressButtonComponent {
    @Input() baseText: string = 'Save';
    @Input() progressText: string = 'Saving';
    @Input() progress: boolean = false;
}
