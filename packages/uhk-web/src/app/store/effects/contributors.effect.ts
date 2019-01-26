import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';

import { Observable } from 'rxjs/Observable';
import { from } from 'rxjs/observable/from';
import { of } from 'rxjs/observable/of';
import { map, switchMap, catchError, reduce, mergeMap, withLatestFrom } from 'rxjs/operators';

import { Constants } from 'uhk-common';

import { AppState, contributors } from '../index';
import { UHKContributor } from '../../models/uhk-contributor';
import {
    AgentContributorsAvailableAction,
    AgentContributorsNotAvailableAction,
    GetAgentContributorsAction,
    ActionTypes,
    FetchAgentContributorsAction
} from '../actions/contributors.action';

@Injectable()
export class ContributorsEffect {
    @Effect() getContributors$: Observable<Action> = this.actions$
        .ofType<GetAgentContributorsAction>(ActionTypes.GET_AGENT_CONTRIBUTORS)
        .pipe(
            withLatestFrom(this.store.select(contributors)),
            map(([action, state]) => {
                if (state.contributors.length === 0) {
                    return new FetchAgentContributorsAction();
                }
                return new AgentContributorsAvailableAction(state.contributors);
            })
        );

    @Effect() fetchContributors$: Observable<Action> = this.actions$
        .ofType<FetchAgentContributorsAction>(ActionTypes.FETCH_AGENT_CONTRIBUTORS)
        .pipe(
            mergeMap(() => this.http.get<UHKContributor[]>(Constants.AGENT_CONTRIBUTORS_GITHUB_API_URL)),
            switchMap((response: UHKContributor[]) => {
                return from(response).pipe(
                    mergeMap(
                        (contributor: UHKContributor) => {
                            return this.http.get(contributor.avatar_url, { responseType: 'blob' });
                        },
                        (contributor, blob) => {
                            contributor.avatar = blob;

                            return contributor;
                        }
                    ),
                    reduce((acc: UHKContributor[], curr) => [...acc, curr], [])
                );
            }),
            map(
                (contributorsWithAvatars: UHKContributor[]) => {
                    contributorsWithAvatars = contributorsWithAvatars.sort((a, b) => b.contributions - a.contributions);

                    return new AgentContributorsAvailableAction(contributorsWithAvatars);
                }
            ),
            catchError(error => of(new AgentContributorsNotAvailableAction(error)))
        );

    constructor(private store: Store<AppState>, private actions$: Actions, private http: HttpClient) {}
}
