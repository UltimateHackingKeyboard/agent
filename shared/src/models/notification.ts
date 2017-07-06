export enum NotificationType {
    Default,
    Success,
    Error,
    Warning,
    Info,
    Undoable
}

export interface Notification {
    type: NotificationType;
    title?: string;
    message: string;
    extra?: any;
}
