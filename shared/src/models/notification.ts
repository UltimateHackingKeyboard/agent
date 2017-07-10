export enum NotificationType {
    Default,
    Success,
    Error,
    Warning,
    Info
}

export interface Notification {
    type: NotificationType;
    title?: string;
    message: string;
    extra?: any;
}
