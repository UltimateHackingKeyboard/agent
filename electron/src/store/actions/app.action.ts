import { Action } from '@ngrx/store';
import { type } from '../../shared/util/';

const PREFIX = '[app] ';

// tslint:disable-next-line:variable-name
export const ActionTypes = {
    APP_BOOTSRAPPED: type(PREFIX + 'bootstrapped'),
    APP_STARTED: type(PREFIX + 'started')
};

export class AppBootsrappedAction implements Action {
    type = ActionTypes.APP_BOOTSRAPPED;
}

export class AppStartedAction implements Action {
    type = ActionTypes.APP_STARTED;
}

export type Actions
    = AppStartedAction
    | AppBootsrappedAction;
