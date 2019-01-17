import { getResponseCode, ResponseCodes } from '../../src';

describe('response-parser', () => {
    describe('getResponseCode', () => {
        it('should return with success', () => {
            const buffer = Buffer.from([0x03, 0x00, 0x08, 0x00, 0xa7, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00]);
            const responseCode = getResponseCode(buffer);
            expect(responseCode).toEqual(ResponseCodes.Success);
        });

        it('should return with UnknownProperty', () => {
            const buffer = Buffer.from([0x03, 0x00, 0x08, 0x00, 0xa7, 0x00, 0x00, 0x01, 0x3c, 0x28, 0x00, 0x00]);
            const responseCode = getResponseCode(buffer);
            expect(responseCode).toEqual(ResponseCodes.UnknownProperty);
        });
    });
});
