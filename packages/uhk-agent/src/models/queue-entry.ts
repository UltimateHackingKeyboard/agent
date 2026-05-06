/* eslint-disable @typescript-eslint/no-explicit-any */
export interface QueueEntry {
    method: Function;
    bind: any;
    params?: any[];
    asynchronous?: boolean;
}
