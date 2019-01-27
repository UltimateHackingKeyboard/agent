import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'help-page',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './help-page.component.html',
    styleUrls: ['./help-page.component.scss'],
    host: {
        class: 'container-fluid'
    }
})
export class HelpPageComponent {}
