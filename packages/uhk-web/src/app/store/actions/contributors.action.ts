import { Action } from '@ngrx/store';

import { UHKContributor } from '../../models/uhk-contributor';

export enum ActionTypes {
    GetAgentContributors = '[contributors] Get',
    FetchAgentContributors = '[contributors] Fetch',
    AgentContributorsAvailable = '[contributors] Available',
    AgentContributorsNotAvailable = '[contributors] Not available'
}

export class GetAgentContributorsAction implements Action {
    type = ActionTypes.GetAgentContributors;
}

export class FetchAgentContributorsAction implements Action {
    type = ActionTypes.FetchAgentContributors;
}

export class AgentContributorsAvailableAction implements Action {
    type = ActionTypes.AgentContributorsAvailable;

    constructor(public payload: UHKContributor[]) {
    }
}

export class AgentContributorsNotAvailableAction implements Action {
    type = ActionTypes.AgentContributorsNotAvailable;

    constructor(public payload: Error) {
        console.error(payload);
    }
}

export type Actions
    = FetchAgentContributorsAction
    | AgentContributorsAvailableAction
    | AgentContributorsNotAvailableAction
    | FetchAgentContributorsAction
    | GetAgentContributorsAction;
