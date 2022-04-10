import { ResponseCodes } from '../enums/response-codes.js';
import { ResponseTags } from '../enums/response-tags.js';

export interface CommandResponse {
    tag: ResponseTags;
    code: ResponseCodes;
    raw: Buffer;
}
