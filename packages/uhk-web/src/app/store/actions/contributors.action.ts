import { Action } from '@ngrx/store';

import { type } from 'uhk-common';

import { UHKContributor } from '../../models/uhk-contributor';

const PREFIX = '[contributors] ';

// tslint:disable-next-line:variable-name
export const ActionTypes = {
    GET_AGENT_CONTRIBUTORS: type(PREFIX + 'Get'),
    FETCH_AGENT_CONTRIBUTORS: type(PREFIX + 'Fetch'),
    AGENT_CONTRIBUTORS_AVAILABLE: type(PREFIX + 'Available'),
    AGENT_CONTRIBUTORS_NOT_AVAILABLE: type(PREFIX + 'Not available')
};

export class GetAgentContributorsAction implements Action {
    type = ActionTypes.GET_AGENT_CONTRIBUTORS;
}
export class FetchAgentContributorsAction implements Action {
    type = ActionTypes.FETCH_AGENT_CONTRIBUTORS;
}

export class AgentContributorsAvailableAction implements Action {
    type = ActionTypes.AGENT_CONTRIBUTORS_AVAILABLE;

    constructor(public payload: UHKContributor[]) {}
}

export class AgentContributorsNotAvailableAction implements Action {
    type = ActionTypes.AGENT_CONTRIBUTORS_NOT_AVAILABLE;

    constructor(public payload: Error) {
        console.error(payload);
    }
}

export type Actions =
    | FetchAgentContributorsAction
    | AgentContributorsAvailableAction
    | AgentContributorsNotAvailableAction
    | FetchAgentContributorsAction
    | GetAgentContributorsAction;
