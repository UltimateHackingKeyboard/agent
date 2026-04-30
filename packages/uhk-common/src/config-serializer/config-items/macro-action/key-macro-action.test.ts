import { describe, it } from 'node:test';

import { DEFAULT_SERIALISATION_INFO } from '../serialisation-info.js';
import { KeyMacroAction } from './key-macro-action.js';
import { binaryDefaultHelper, jsonDefaultHelper } from '../../../../test/serializer-test-helper.js';
import { MacroKeySubAction } from './macro-action.js';
import { KeystrokeType } from '../key-action/keystroke-type.js';

describe('key-macro-action', () => {
    it('should be instantiate', ({ assert }) => {
        const action = new KeyMacroAction();
        assert.ok(action);
    });

    describe('full serialization', () => {
        it('should json match', ({ assert }) => {
            const action = new KeyMacroAction();
            action.action = MacroKeySubAction.press;
            action.type = KeystrokeType.basic;
            action.scancode = 100;
            jsonDefaultHelper(assert, action, DEFAULT_SERIALISATION_INFO);
        });

        it('should binary match', ({ assert }) => {
            const action = new KeyMacroAction();
            action.action = MacroKeySubAction.press;
            action.type = KeystrokeType.basic;
            action.scancode = 100;
            binaryDefaultHelper(assert, action, DEFAULT_SERIALISATION_INFO);
        });
    });
});
