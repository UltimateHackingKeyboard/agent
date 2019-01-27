import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { Constants } from 'uhk-common';

import { getVersions } from '../../../util';

import { AppState, contributors } from '../../../store';
import { State } from '../../../store/reducers/contributors.reducer';
import { OpenUrlInNewWindowAction } from '../../../store/actions/app';
import { GetAgentContributorsAction } from '../../../store/actions/contributors.action';

@Component({
    selector: 'about-page',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.scss'],
    host: {
        class: 'container-fluid'
    }
})
export class AboutComponent implements OnInit {
    version: string = getVersions().version;
    agentGithubUrl = Constants.AGENT_GITHUB_URL;
    agentContributorsUrl = Constants.AGENT_CONTRIBUTORS_GITHUB_PAGE_URL;
    state$: Observable<State>;

    constructor(private store: Store<AppState>) {}

    ngOnInit() {
        this.state$ = this.store.select(contributors);

        this.store.dispatch(new GetAgentContributorsAction());
    }

    openUrlInBrowser(event: Event): void {
        event.preventDefault();

        this.store.dispatch(new OpenUrlInNewWindowAction((event.target as Element).getAttribute('href')));
    }
}
