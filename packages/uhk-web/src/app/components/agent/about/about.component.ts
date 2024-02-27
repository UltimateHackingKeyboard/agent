import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

import { Constants } from 'uhk-common';

import { getVersions } from '../../../util';

import { AppState, contributors } from '../../../store';
import { State } from '../../../store/reducers/contributors.reducer';
import { ShowAdvancedSettingsMenuAction } from '../../../store/actions/advance-settings.action';
import { GetAgentContributorsAction } from '../../../store/actions/contributors.action';

@Component({
    selector: 'about-page',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.scss'],
    host: {
        'class': 'container-fluid d-block'
    }
})
export class AboutComponent implements OnInit {
    version: string = getVersions().version;
    agentGithubUrl: string = Constants.AGENT_GITHUB_URL;
    agentContributorsUrl: string = Constants.AGENT_CONTRIBUTORS_GITHUB_PAGE_URL;
    logoClickCounter = 0;
    state$: Observable<State>;
    faSpinner = faSpinner;

    constructor(private store: Store<AppState>) {
    }

    ngOnInit() {
        this.state$ = this.store.select(contributors);

        this.store.dispatch(new GetAgentContributorsAction());
    }

    onAgentIconClicked(event: MouseEvent): void {
        this.logoClickCounter++;

        if (this.logoClickCounter === 7) {
            this.store.dispatch(new ShowAdvancedSettingsMenuAction());
        }
    }
}
