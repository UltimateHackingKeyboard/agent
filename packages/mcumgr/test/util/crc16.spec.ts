import * as assert from 'node:assert/strict';

import crc16 from '../../src/util/crc16.js';

describe('crc16', () => {
    it('should work', () => {
        const crc = crc16([
            0x02, 0x00, 0x00, 0x09, 0x00, 0x00, 0x09, 0x00,
            0xA1, 0x61, 0x64, 0x65, 0x68, 0x65, 0x6C, 0x6C,
            0x6F,
        ]);

        assert.equal(crc, 24488);
    });
});
