import * as assert from 'node:assert/strict';
import { UHK_DEVICE_IDS } from 'uhk-common';

import calculateBcdDevice from '../../src/utils/calculate-bcd-device.js';

describe('calculateBcdDevice', () => {
    it('calculate correct value when bootloader is true', () => {
        const bcdDevice = calculateBcdDevice(UHK_DEVICE_IDS.UHK80_RIGHT, true);

        assert.equal(bcdDevice, 260);
    });

    it('calculate correct value when bootloader is false', () => {
        const bcdDevice = calculateBcdDevice(UHK_DEVICE_IDS.UHK80_RIGHT, false);

        assert.equal(bcdDevice, 4);
    });
});
