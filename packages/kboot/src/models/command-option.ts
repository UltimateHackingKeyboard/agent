import { Commands } from '../enums';

export interface CommandOption {
    command: Commands;
    hasDataPhase?: boolean;
    params?: number[];
    timeout?: number;
}
