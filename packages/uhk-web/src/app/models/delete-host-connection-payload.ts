import { HostConnection } from 'uhk-common';

export interface DeleteHostConnectionPayload {
    index: number;
    hostConnection: HostConnection;
}
