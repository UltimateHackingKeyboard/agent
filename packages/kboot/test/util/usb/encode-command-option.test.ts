import { describe, it } from 'node:test';

import { CommandOption, Commands, encodeCommandOption } from '../../../src/index.js';

describe('usb encodeCommandOption', () => {
    it('should convert correctly', ({ assert }) => {
        const option: CommandOption = {
            command: Commands.GetProperty,
            params: [1, 0, 0, 0, 0, 0, 0, 0]
        };

        const result = encodeCommandOption(option);
        const expected = [1, 0, 0x0c, 0, 0x07, 0x00, 0x00, 0x02, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        assert.deepStrictEqual(result, expected);
    });
});
