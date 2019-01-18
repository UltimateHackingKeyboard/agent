import { CommandResponse } from '../../models';
import { getResponseCode, getResponseTag } from '../response-parser';

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
