import {it, test} from 'node:test';

import crc16XModem from "../lib/index.js";

test('standard check vector "123456789" → 0x31C3', ({ assert }) => {
    assert.strictEqual(crc16XModem(Buffer.from('123456789')), 0x31C3);
});

test('empty buffer returns init value', ({ assert }) => {
    assert.strictEqual(crc16XModem([]), 0x0000); // XModem init is 0
});

test('single byte', ({ assert }) => {
    assert.strictEqual(crc16XModem([0x00]), 0x0000);
    assert.strictEqual(crc16XModem([0xFF]), 0x1EF0);
});

it('uhk command', ({ assert }) => {
    const crc = crc16XModem([
        0x02, 0x00, 0x00, 0x09, 0x00, 0x00, 0x09, 0x00,
        0xA1, 0x61, 0x64, 0x65, 0x68, 0x65, 0x6C, 0x6C,
        0x6F,
    ]);

    assert.strictEqual(crc, 24488);
});
