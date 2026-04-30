import { describe, it } from 'node:test';

import { binaryDefaultHelper, jsonDefaultHelper } from '../../../../test/serializer-test-helper.js';
import { DEFAULT_SERIALISATION_INFO } from '../serialisation-info.js';
import { PlayMacroAction } from './play-macro-action.js';

// TODO: Add null, undefined, empty object, empty buffer test cases
describe('play-action', () => {
    const macros = [{id: 1}, {id: 2}];
    const userConfiguration = {macros};

    it('should be instantiate', ({ assert }) => {
        const action = new PlayMacroAction();
        assert.ok(action);
    });

    describe('toString', () => {
        it('should return <PlayMacroAction macroId="1">', ({ assert }) => {
            const action = new PlayMacroAction();
            action.macroId = 1;
            assert.strictEqual(action.toString(), '<PlayMacroAction macroId="1">');
        });
    });

    describe('getName', () => {
        it('should return with "PlayMacroAction"', ({ assert }) => {
            const action = new PlayMacroAction();
            assert.strictEqual(action.getName(), 'PlayMacroAction');
        });
    });

    describe('full serialization', () => {
        it('should json match', ({ assert }) => {
            const action = new PlayMacroAction();
            action.macroId = 1;
            jsonDefaultHelper(assert, action, DEFAULT_SERIALISATION_INFO, macros, macros);
        });

        it('should binary match', ({ assert }) => {
            const action = new PlayMacroAction();
            action.macroId = 1;
            binaryDefaultHelper(assert, action, DEFAULT_SERIALISATION_INFO, userConfiguration, macros);
        });
    });
});
