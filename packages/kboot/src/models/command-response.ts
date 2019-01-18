import { ResponseCodes, ResponseTags } from '../enums';

export interface CommandResponse {
    tag: ResponseTags;
    code: ResponseCodes;
    raw: Buffer;
}
