import { Buffer } from 'uhk-common';

import { I2cErrorBuffer, I2cErrorStatus, Slave } from '../models';

const SLAVE_ID_TO_NAME = [
    'leftHalf',
    'leftModule',
    'rightModule',
    'rightLedDriver',
    'leftLedDriver',
    'kboot'
];

const STATUS_CODE_TO_NAME = {
    0: 'nak',
    1: 'failure',
    1100: 'busy',
    1101: 'idle',
    1102: 'nak',
    1103: 'arbitrationLost',
    1104: 'timeout',
    20000: 'idleSlave',
    20001: 'idleCycle'
};

export function convertSlaveI2cErrorBuffer(buffer: Buffer, slaveId: number): I2cErrorBuffer {
    const statusCount = buffer[1];
    const slave: Slave = {
        id: slaveId,
        name: SLAVE_ID_TO_NAME[slaveId]
    };
    const statuses: Array<I2cErrorStatus> = [];
    for (let i = 0; i < statusCount; i++) {
        const code = buffer.readUInt32LE(i * 8 + 2);
        statuses.push({
            code,
            name: STATUS_CODE_TO_NAME[code],
            count: buffer.readUInt32LE(i * 8 + 4 + 2)
        });
    }

    return {
        slave,
        statuses
    };
}
