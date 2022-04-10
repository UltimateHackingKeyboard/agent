import { decodeCommandResponse } from '../../../src/index.js';

describe('decodeCommandResponse', () => {
    it('should parse the command', () => {
        const arr = '03 00 0c 00 a0 00 00 02 00 00 00 00 c1 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00';
        const buffer = Buffer.from(arr);
        const response = decodeCommandResponse(buffer);

        expect(response.code).toEqual(0);
        expect(response.tag).toEqual(0);
    });
});
