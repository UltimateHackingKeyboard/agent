import { ResponseCodes } from '../enums/response-codes.js';
import { ResponseTags } from '../enums/response-tags.js';

export const convertLittleEndianNumber = (data: Buffer): number => {
    let value = 0;

    for (let i = 0; i < data.length; i++) {
        value += data[i] << (8 * i);
    }

    return value;
};

export const getResponseCode = (response: Buffer): ResponseCodes => {
    const data = response.slice(8, 11);

    return convertLittleEndianNumber(data);
};

export const getResponseTag = (response: Buffer): ResponseTags => {
    return response[4];
};
