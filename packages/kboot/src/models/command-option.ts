import { Commands } from '../enums/commands.js';

export interface CommandOption {
    command: Commands;
    hasDataPhase?: boolean;
    params?: number[];
    timeout?: number;
}
