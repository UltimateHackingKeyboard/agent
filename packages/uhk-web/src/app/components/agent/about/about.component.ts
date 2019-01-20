import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators/catchError';
import { of } from 'rxjs/observable/of';

import { Constants } from 'uhk-common';

import { UHKContributor } from '../../../models/uhk-contributor';
import { getVersions } from '../../../util';

@Component({
    selector: 'about-page',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.scss'],
    host: {
        'class': 'container-fluid'
    }
})
export class AboutComponent implements OnInit {
    version: string = getVersions().version;
    agentGithubUrl = Constants.AGENT_GITHUB_URL;
    contributors$: Observable<UHKContributor[]>;

    constructor(private http: HttpClient) {
    }

    ngOnInit() {
        this.contributors$ =
            this.http.get<UHKContributor[]>('http://api.github.com/repos/UltimateHackingKeyboard/agent/contributors').pipe(
                catchError(error => of(null))
            );
    }
}
