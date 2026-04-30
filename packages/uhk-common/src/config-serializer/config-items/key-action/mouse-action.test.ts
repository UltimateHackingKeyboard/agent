import { describe, it } from 'node:test';

import { binaryDefaultHelper, jsonDefaultHelper } from '../../../../test/serializer-test-helper.js';
import { DEFAULT_SERIALISATION_INFO } from '../serialisation-info.js';
import { MouseAction, MouseActionParam } from './mouse-action.js';

// TODO: Add null, undefined, empty object, empty buffer test cases
describe('mouse-action', () => {
    it('should be instantiate', ({ assert }) => {
        const action = new MouseAction();
        assert.ok(action);
    });

    describe('toString', () => {
        it(`should return with <MouseAction mouseAction="${MouseActionParam.leftClick}">`, ({ assert }) => {
            const action = new MouseAction();
            action.mouseAction = MouseActionParam.leftClick;
            assert.strictEqual(action.toString(), `<MouseAction mouseAction="${MouseActionParam.leftClick}">`);
        });
    });

    describe('getName', () => {
        it('should return with "MouseAction"', ({ assert }) => {
            const action = new MouseAction();
            assert.strictEqual(action.getName(), 'MouseAction');
        });
    });

    describe('full serialization', () => {
        it('should json match', ({ assert }) => {
            const action = new MouseAction();
            action.mouseAction = MouseActionParam.leftClick;
            jsonDefaultHelper(assert, action, DEFAULT_SERIALISATION_INFO);
        });

        it('should binary match', ({ assert }) => {
            const action = new MouseAction();
            action.mouseAction = MouseActionParam.leftClick;
            binaryDefaultHelper(assert, action, DEFAULT_SERIALISATION_INFO);
        });
    });
});
