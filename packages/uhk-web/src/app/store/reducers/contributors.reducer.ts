import { Actions, ActionTypes } from '../actions/contributors.action';
import { AgentContributorsAvailableAction, AgentContributorsNotAvailableAction } from '../actions/contributors.action';
import { UHKContributor } from '../../models/uhk-contributor';

export interface State {
    isLoading: boolean;
    contributors: UHKContributor[];
    error?: any;
}

export const initialState: State = {
    isLoading: false,
    contributors: [],
    error: null
};

export function reducer(state = initialState, action: Actions) {
    switch (action.type) {
        case ActionTypes.GET_AGENT_CONTRIBUTORS: {
            return {
                ...state
            };
        }

        case ActionTypes.FETCH_AGENT_CONTRIBUTORS: {
            return {
                ...state,
                isLoading: true
            };
        }

        case ActionTypes.AGENT_CONTRIBUTORS_AVAILABLE: {
            return {
                ...state,
                contributors: (<AgentContributorsAvailableAction>action).payload,
                isLoading: false
            };
        }

        case ActionTypes.AGENT_CONTRIBUTORS_NOT_AVAILABLE: {
            return {
                ...state,
                error: (<AgentContributorsNotAvailableAction>action).payload,
                isLoading: false
            };
        }

        default:
            return state;
    }
}
