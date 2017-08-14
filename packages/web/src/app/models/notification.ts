import { Action } from '@ngrx/store';

export enum NotificationType {
    Default = 'default',
    Success = 'success',
    Error = 'error',
    Warning = 'warning',
    Info = 'info',
    Undoable = 'undoable'
}

export interface Notification {
    type: NotificationType;
    title?: string;
    message: string;
    extra?: Action;
}
