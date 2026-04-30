import { describe, it } from 'node:test';

import { binaryDefaultHelper, jsonDefaultHelper } from '../../../../test/serializer-test-helper.js';
import { DEFAULT_SERIALISATION_INFO } from '../serialisation-info.js';
import { SwitchKeymapAction } from './switch-keymap-action.js';

// TODO: Add null, undefined, empty object, empty buffer test cases
describe('switch-keymap-action', () => {
    const userConfiguration = {
        keymaps: [
            {abbreviation: 'AB1'},
            {abbreviation: 'AB2'}
        ]
    };

    it('should be instantiate', ({ assert }) => {
        const action = new SwitchKeymapAction();
        assert.ok(action);
    });

    describe('toString', () => {
        it('should return <SwitchKeymapAction keymapAbbreviation="ABB">', ({ assert }) => {
            const action = new SwitchKeymapAction('ABB');
            assert.strictEqual(action.toString(), '<SwitchKeymapAction keymapAbbreviation="ABB">');
        });
    });

    describe('getName', () => {
        it('should return with "SwitchKeymapAction"', ({ assert }) => {
            const action = new SwitchKeymapAction();
            assert.strictEqual(action.getName(), 'SwitchKeymapAction');
        });
    });

    describe('full serialization', () => {
        it('should json match', ({ assert }) => {
            const action = new SwitchKeymapAction('AB1');
            jsonDefaultHelper(assert, action, DEFAULT_SERIALISATION_INFO);
        });

        it.skip('should binary match', ({ assert }) => {
            const action = new SwitchKeymapAction('AB1');
            binaryDefaultHelper(assert, action, DEFAULT_SERIALISATION_INFO, userConfiguration, userConfiguration);
        });
    });
});
