import { getResponseCode, ResponseCodes } from '../../src';

describe('response-parser', () => {
    fdescribe('getResponseCode', () => {
        it('should return with success', () => {
            const responseCode = getResponseCode([0x03, 0x00, 0x08, 0x00, 0xa7, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00]);
            expect(responseCode).toEqual(ResponseCodes.Success);
        });

        it('should return with UnknownProperty', () => {
            const responseCode = getResponseCode([0x03, 0x00, 0x08, 0x00, 0xa7, 0x00, 0x00, 0x01, 0x3c, 0x28, 0x00, 0x00]);
            expect(responseCode).toEqual(ResponseCodes.UnknownProperty);
        });
    });
});
