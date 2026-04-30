import { describe, it } from 'node:test';

import { getResponseCode, ResponseCodes } from '../../src/index.js';

describe('response-parser', () => {
    describe('getResponseCode', () => {
        it('should return with success', ({ assert }) => {
            const buffer = Buffer.from([0x03, 0x00, 0x08, 0x00, 0xa7, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00]);
            const responseCode = getResponseCode(buffer);
            assert.strictEqual(responseCode,ResponseCodes.Success);
        });

        it('should return with UnknownProperty', ({ assert }) => {
            const buffer = Buffer.from([0x03, 0x00, 0x08, 0x00, 0xa7, 0x00, 0x00, 0x01, 0x3c, 0x28, 0x00, 0x00]);
            const responseCode = getResponseCode(buffer);
            assert.strictEqual(responseCode, ResponseCodes.UnknownProperty);
        });
    });
});
