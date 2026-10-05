import { describe, it } from 'node:test';

import {
    convertHistoryFilenameToDisplayText,
    convertDateToDisplayText,
    getUserConfigHistoryFilename,
} from './user-configuration-history-helpers.js';

it('getUserConfigHistoryFilename should return with proper name', ({ assert, mock }) => {
    const md5Hash = '1234567890abcdef1234567890abcdef';
    const fakeNow = new Date(2026, 4, 28, 15, 23, 45)
    mock.timers.enable({ apis: ['Date'], now: fakeNow })
    const filename = getUserConfigHistoryFilename(md5Hash);

    assert.strictEqual(filename, '20260528-152345-1234567890abcdef1234567890abcdef.bin');
});

it('convertDateToDisplayText should properly format date', ({ assert }) => {
    const testDate = new Date(2026, 4, 28, 15, 23, 45);
    const displayText = convertDateToDisplayText(testDate);

    assert.strictEqual(displayText, '2026-05-28 15:23:45');
});

describe('convertHistoryFilenameToDisplayText', () => {
    it('should properly parses filename', ({ assert }) => {
        const testFilename = '20260528-152345-1234567890abcdef1234567890abcdef.bin';
        const displayText = convertHistoryFilenameToDisplayText(testFilename);

        assert.strictEqual(displayText, '2026-05-28 15:23:45');
    });

    it('should return with "Invalid date" when filename length shorter than 15 character', ({ assert }) => {
        const testFilename = '20260528-15234';
        const displayText = convertHistoryFilenameToDisplayText(testFilename);

        assert.strictEqual(displayText, 'Invalid date');
    });
})
