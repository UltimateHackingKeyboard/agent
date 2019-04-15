import { ChangeDetectionStrategy, Component } from '@angular/core';

import { Constants } from 'uhk-common';

@Component({
    selector: 'help-page',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './help-page.component.html',
    styleUrls: ['./help-page.component.scss'],
    host: {
        'class': 'container-fluid'
    }
})
export class HelpPageComponent {
    agentHelpAccentCharsUrl: string = Constants.AGENT_HELP_ACCENT_CHARS_URL;
}
