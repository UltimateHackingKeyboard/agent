import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Constants } from 'uhk-common';

import { AppState } from '../../../store';
import { getVersions } from '../../../util';
import { OpenUrlInNewWindowAction } from '../../../store/actions/app';

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

    constructor(private store: Store<AppState>) {
    }

    openAgentGitHubPage(event) {
        event.preventDefault();
        this.store.dispatch(new OpenUrlInNewWindowAction(Constants.AGENT_GITHUB_URL));
    }
}
