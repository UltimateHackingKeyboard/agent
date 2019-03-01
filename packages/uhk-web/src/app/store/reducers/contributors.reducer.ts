import * as Contributors from '../actions/contributors.action';
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

export function reducer(state = initialState, action: Contributors.Actions) {
    switch (action.type) {
        case Contributors.ActionTypes.GetAgentContributors: {
            return {
                ...state
            };
        }

        case Contributors.ActionTypes.FetchAgentContributors: {
            return {
                ...state,
                isLoading: true
            };
        }

        case Contributors.ActionTypes.AgentContributorsAvailable: {
            return {
                ...state,
                contributors: (<Contributors.AgentContributorsAvailableAction>action).payload,
                isLoading: false
            };
        }

        case Contributors.ActionTypes.AgentContributorsNotAvailable: {
            return {
                ...state,
                error: (<Contributors.AgentContributorsNotAvailableAction>action).payload,
                isLoading: false
            };
        }

        default:
            return state;
    }
}
