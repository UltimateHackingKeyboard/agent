import { Action } from '@ngrx/store';

export namespace NotificationActions {
    export const PREFIX = '[Notification] ';

    export const SHOW = NotificationActions.PREFIX + 'Show notification';

    export function showNotification(message: string): Action {
        return {
            type: NotificationActions.SHOW,
            payload: message
        };
    }
}
