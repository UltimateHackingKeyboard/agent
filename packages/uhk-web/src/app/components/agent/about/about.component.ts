import { Component } from '@angular/core';
import { Constants } from 'uhk-common';

import { getVersions } from '../../../util';

@Component({
    selector: 'about-page',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.scss'],
    host: {
        'class': 'container-fluid'
    }
})
export class AboutComponent {
    version: string = getVersions().version;
    agentGithubUrl = Constants.AGENT_GITHUB_URL;
}
