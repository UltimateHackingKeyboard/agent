import { NoneAction } from './none-action.js';
import { keyActionType } from './key-action.js';
import { UhkBuffer } from '../../uhk-buffer.js';
import { binaryDefaultHelper, jsonDefaultHelper } from '../../../../test/serializer-test-helper.js';

// TODO: Add null, undefined, empty object, empty buffer test cases
describe('node-action', () => {
    it('should be instantiate', () => {
        const action = new NoneAction();
        expect(action).toBeTruthy();
    });

    describe('fromJsonObject', () => {
        it('should map null', () => {
            const action = new NoneAction();
            expect(action.fromJsonObject({keyActionType: keyActionType.NoneAction})).toEqual(new NoneAction());
        });
    });

    describe('toJsonObject', () => {
        it('should work', () => {
            const action = new NoneAction();
            expect(action.toJsonObject()).toEqual({
                keyActionType: keyActionType.NoneAction
            });
        });
    });

    describe('fromBinary', () => {
        it('should work', () => {
            const buffer = new UhkBuffer();
            const action = new NoneAction();
            action.toBinary(buffer);
            expect(action).toEqual(new NoneAction());
        });
    });

    describe('toBinary', () => {
        it('should work', () => {
            const buffer = new UhkBuffer();
            const action = new NoneAction();
            action.toBinary(buffer);

            const expected = new UhkBuffer();
            expected.offset = 1;
            expect(buffer).toEqual(expected);
        });
    });

    describe('toString', () => {
        it('should return with "<NoneAction>"', () => {
            const action = new NoneAction();
            expect(action.toString()).toEqual('<NoneAction>');
        });
    });

    describe('getName', () => {
        it('should return with "NoneAction"', () => {
            const action = new NoneAction();
            expect(action.getName()).toEqual('NoneAction');
        });
    });

    describe('full serialization', () => {
        it('should json match with default constructor', () => {
            jsonDefaultHelper(new NoneAction());
        });

        it('should binary match with default constructor', () => {
            binaryDefaultHelper(new NoneAction());
        });
    });
});
