import { describe, it } from 'node:test';

import { DEFAULT_SERIALISATION_INFO } from '../serialisation-info.js';
import { NoneAction } from './none-action.js';
import { keyActionType } from './key-action.js';
import { UhkBuffer } from '../../uhk-buffer.js';
import { binaryDefaultHelper, jsonDefaultHelper } from '../../../../test/serializer-test-helper.js';

// TODO: Add null, undefined, empty object, empty buffer test cases
describe('node-action', () => {
    it('should be instantiate', ({ assert }) => {
        const action = new NoneAction();
        assert.ok(action);
    });

    describe('fromJsonObject', () => {
        it('should map null', ({ assert }) => {
            const action = new NoneAction();
            assert.deepStrictEqual(action.fromJsonObject({keyActionType: keyActionType.NoneAction}, DEFAULT_SERIALISATION_INFO), new NoneAction());
        });
    });

    describe('toJsonObject', () => {
        it('should work', ({ assert }) => {
            const action = new NoneAction();
            assert.deepStrictEqual(action.toJsonObject(DEFAULT_SERIALISATION_INFO), { keyActionType: keyActionType.NoneAction });
        });
    });

    describe('fromBinary', () => {
        it('should work', ({ assert }) => {
            const buffer = new UhkBuffer();
            const action = new NoneAction();
            action.toBinary(buffer, DEFAULT_SERIALISATION_INFO);
            assert.deepStrictEqual(action, new NoneAction());
        });
    });

    describe('toBinary', () => {
        it('should work', ({ assert }) => {
            const buffer = new UhkBuffer();
            const action = new NoneAction();
            action.toBinary(buffer, DEFAULT_SERIALISATION_INFO);

            const expected = new UhkBuffer();
            expected.offset = 1;
            assert.deepStrictEqual(buffer, expected);
        });
    });

    describe('toString', () => {
        it('should return with "<NoneAction>"', ({ assert }) => {
            const action = new NoneAction();
            assert.strictEqual(action.toString(), '<NoneAction>');
        });
    });

    describe('getName', () => {
        it('should return with "NoneAction"', ({ assert }) => {
            const action = new NoneAction();
            assert.strictEqual(action.getName(), 'NoneAction');
        });
    });

    describe('full serialization', () => {
        it('should json match with default constructor', ({ assert }) => {
            jsonDefaultHelper(assert, new NoneAction(), DEFAULT_SERIALISATION_INFO);
        });

        it('should binary match with default constructor', ({ assert }) => {
            binaryDefaultHelper(assert, new NoneAction(), DEFAULT_SERIALISATION_INFO);
        });
    });
});
