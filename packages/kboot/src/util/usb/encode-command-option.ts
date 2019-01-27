import { isNullOrUndefined } from 'util';
import { pack } from 'byte-data';

import { CommandOption } from '../../models';

/**
 * Encode the USB Command.
 * @param option
 */
export const encodeCommandOption = (option: CommandOption): number[] => {
    const payload = [
        option.command,
        option.hasDataPhase ? 1 : 0,
        0, // Reserved. Should be 0
        option.params ? (option.params.length / 4) >> 0 : 0 // number of parameters
    ];

    if (option.params) {
        payload.push(...option.params);
    }

    const header = [
        1, // Communication channel
        0, // TODO: What is it?
        ...pack(payload.length, { bits: 16 }), // payload length in 2 byte
    ];

    const placeholders = new Array(32 - payload.length).fill(0);

    return [...header, ...payload, ...placeholders];
};

export const validateCommandParams = (params: any[]): void => {
    if (isNullOrUndefined(params)) {
        return;
    }

    if (!Array.isArray(params)) {
        throw new Error('Command parameters must be an array!');
    }

    if (params.length > 28) {
        throw new Error('Maximum 7 (28 bytes) command parameters allowed!');
    }
};
