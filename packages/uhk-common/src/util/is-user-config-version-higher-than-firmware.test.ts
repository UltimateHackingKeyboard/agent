import { describe, it } from 'node:test';

import { isUserConfigVersionHigherThanFirmware } from './is-user-config-version-higher-than-firmware.js';

describe('isUserConfigVersionHigherThanFirmware', () => {
    it('should return false when versions are equal', ({ assert }) => {
        assert.equal(isUserConfigVersionHigherThanFirmware('12.0.1', '12.0.1'), false);
    });

    it('should return false when user config is older than firmware', ({ assert }) => {
        assert.equal(isUserConfigVersionHigherThanFirmware('12.0.0', '12.0.1'), false);
    });

    it('should return true when user config minor is newer than firmware', ({ assert }) => {
        assert.equal(isUserConfigVersionHigherThanFirmware('12.1.0', '12.0.1'), true);
    });

    it('should return true when user config patch is newer than firmware', ({ assert }) => {
        assert.equal(isUserConfigVersionHigherThanFirmware('12.0.2', '12.0.1'), true);
    });

    it('should return false when user config version is missing', ({ assert }) => {
        assert.equal(isUserConfigVersionHigherThanFirmware('', '12.0.1'), false);
    });

    it('should return false when firmware user config version is missing', ({ assert }) => {
        assert.equal(isUserConfigVersionHigherThanFirmware('12.1.0', ''), false);
    });
});
