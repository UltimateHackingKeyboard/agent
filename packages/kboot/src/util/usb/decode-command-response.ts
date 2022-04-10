import { CommandResponse } from '../../models/command-response.js';
import { getResponseCode, getResponseTag } from '../response-parser.js';

export const decodeCommandResponse = (response: Buffer): CommandResponse => {
    if (response.length < 8) {
        throw new Error('Invalid response length!');
    }

    if (response[0] !== 3) {
        throw new Error(`Invalid response command channel!`);
    }

    return {
        code: getResponseCode(response),
        tag: getResponseTag(response),
        raw: response
    };
};
