import { describe, it } from 'node:test';

import { encodeStringToParams } from '../../src/util/encode-string-to-parameters.js';

describe('encodeStringToParams', () => {
    it.skip('should convert 8 character to little endian 4 byte array', ({ assert }) => {
        const result = encodeStringToParams('0403020108070605');

        const expectedResult = [0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08];

        assert.deepStrictEqual(result, expectedResult);
    });
});
