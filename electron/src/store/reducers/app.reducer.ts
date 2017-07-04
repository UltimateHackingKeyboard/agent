import { Actions, ActionTypes } from '../../shared/store/actions/app.action';

export interface State {
    started: boolean;
}

const initialState: State = {
    started: false
};

export function reducer(state = initialState, action: Actions) {
    switch (action.type) {
        case ActionTypes.APP_STARTED: {
            const newState = Object.assign({}, state);
            newState.started = true;
            return newState;
        }
        default:
            return state;
    }
}
