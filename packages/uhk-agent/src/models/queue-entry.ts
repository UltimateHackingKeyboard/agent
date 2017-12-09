export interface QueueEntry {
    method: Function;
    bind: any;
    params?: any[];
    asynchronous?: boolean;
}
