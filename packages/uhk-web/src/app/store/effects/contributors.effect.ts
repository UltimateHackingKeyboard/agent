import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';

import { from, Observable, of } from 'rxjs';
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
    getContributors$: Observable<Action> = createEffect(() => this.actions$
        .pipe(
            ofType<GetAgentContributorsAction>(ActionTypes.GetAgentContributors),
            withLatestFrom(this.store.select(contributors)),
            map(([action, state]) => {
                if (state.contributors.length === 0) {
                    return new FetchAgentContributorsAction();
                }
                return new AgentContributorsAvailableAction(state.contributors);
            })
        )
    );

    fetchContributors$: Observable<Action> = createEffect(() => this.actions$
        .pipe(
            ofType<FetchAgentContributorsAction>(ActionTypes.FetchAgentContributors),
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
        )
    );

    constructor(private store: Store<AppState>, private actions$: Actions, private http: HttpClient) {
    }
}
