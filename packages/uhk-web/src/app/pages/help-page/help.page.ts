import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'help-page',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './help.page.html'
})
export class HelpPageComponent {

    constructor() {
    }
}
