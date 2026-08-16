import { describe, it } from 'node:test';

import { KeyLanguage } from '../../models/key-language.js';
import {
    formatScancodeDropdownText,
    getBasicScancodeTexts,
    getScancodesForKeyLanguage
} from './scancode-labels.js';

describe('scancode-labels', () => {
    it('returns US labels by default', ({ assert }) => {
        assert.deepStrictEqual(getBasicScancodeTexts(51), [';', ':']);
        assert.deepStrictEqual(getBasicScancodeTexts(28, KeyLanguage.Us), ['Y']);
    });

    it('applies German QWERTZ and umlaut overrides', ({ assert }) => {
        assert.deepStrictEqual(getBasicScancodeTexts(28, KeyLanguage.German), ['Z']);
        assert.deepStrictEqual(getBasicScancodeTexts(29, KeyLanguage.German), ['Y']);
        assert.deepStrictEqual(getBasicScancodeTexts(51, KeyLanguage.German), ['Ö']);
        assert.deepStrictEqual(getBasicScancodeTexts(52, KeyLanguage.German), ['Ä']);
        assert.deepStrictEqual(getBasicScancodeTexts(47, KeyLanguage.German), ['Ü']);
        assert.deepStrictEqual(getBasicScancodeTexts(45, KeyLanguage.German), ['ß', '?']);
    });

    it('applies UK punctuation overrides', ({ assert }) => {
        assert.deepStrictEqual(getBasicScancodeTexts(31, KeyLanguage.Uk), ['2', '"']);
        assert.deepStrictEqual(getBasicScancodeTexts(32, KeyLanguage.Uk), ['3', '£']);
        assert.deepStrictEqual(getBasicScancodeTexts(52, KeyLanguage.Uk), ['\'', '@']);
        assert.deepStrictEqual(getBasicScancodeTexts(50, KeyLanguage.Uk), ['#', '~']);
    });

    it('applies Nordic letter and punctuation overrides', ({ assert }) => {
        assert.deepStrictEqual(getBasicScancodeTexts(47, KeyLanguage.Nordic), ['Å']);
        assert.deepStrictEqual(getBasicScancodeTexts(51, KeyLanguage.Nordic), ['Ö', 'Ø']);
        assert.deepStrictEqual(getBasicScancodeTexts(52, KeyLanguage.Nordic), ['Ä', 'Æ']);
        assert.deepStrictEqual(getBasicScancodeTexts(53, KeyLanguage.Nordic), ['§', '½']);
    });

    it('formats dropdown text without icon tokens', ({ assert }) => {
        assert.strictEqual(formatScancodeDropdownText(['Np 2', 'icon-kbd__mod--arrow-down']), 'Np 2');
        assert.strictEqual(formatScancodeDropdownText(['Ö', 'Ø']), 'Ö Ø');
    });

    it('localizes scancode dropdown groups for German', ({ assert }) => {
        const groups = getScancodesForKeyLanguage(KeyLanguage.German);
        const letterGroup = groups.find(group => group.text === 'Letter');
        const punctuationGroup = groups.find(group => group.text === 'Punctuation');

        const yKey = letterGroup?.children.find(child => child.id === '28');
        const semicolonKey = punctuationGroup?.children.find(child => child.id === '51');

        assert.strictEqual(yKey?.text, 'Z');
        assert.strictEqual(semicolonKey?.text, 'Ö');
    });

    it('keeps media labels unchanged for non-US languages', ({ assert }) => {
        const groups = getScancodesForKeyLanguage(KeyLanguage.Nordic);
        const mediaGroup = groups.find(group => group.text === 'Media');
        const mute = mediaGroup?.children.find(child => child.id === '127');

        assert.strictEqual(mute?.text, 'Mute');
    });
});
