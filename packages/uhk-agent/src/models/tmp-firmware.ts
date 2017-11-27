import { SynchrounousResult } from 'tmp';

export interface TmpFirmware {
    rightFirmwarePath: string;
    leftFirmwarePath: string;
    tmpDirectory: SynchrounousResult;
}
