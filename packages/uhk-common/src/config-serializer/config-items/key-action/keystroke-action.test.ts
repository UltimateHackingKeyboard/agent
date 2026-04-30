import { describe, it } from 'node:test';

import { DEFAULT_SERIALISATION_INFO } from '../serialisation-info.js';
import { KeystrokeAction } from './keystroke-action.js';
import { KeystrokeType } from './keystroke-type.js';
import { SecondaryRoleAction } from '../secondary-role-action.js';

describe('keystroke-action', () => {
    it('should be instantiate', ({ assert }) => {
        const action = new KeystrokeAction();
        assert.ok(action);
    });

    it('Should be inherit from other KeyStroke', ({ assert }) => {
        const other = new KeystrokeAction();
        other.type = KeystrokeType.basic;
        other.scancode = 125;
        other.modifierMask = 1;
        other.secondaryRoleAction = SecondaryRoleAction.leftAlt;
        const action = new KeystrokeAction(other);
        assert.deepStrictEqual(action, other);
    });

    describe('set scancode', () => {
        it('should store the value without modification', ({ assert }) => {
            const value = 125;
            const action = new KeystrokeAction();
            action.scancode = value;
            assert.strictEqual(action.scancode, value);
        });

        it('should not change the "type" when is "basic"', ({ assert }) => {
            const type = KeystrokeType.basic;
            const action = new KeystrokeAction();
            action.type = type;
            action.scancode = 125;
            assert.strictEqual(action.type, type);
        });

        it('should not change the "type" when is "system"', ({ assert }) => {
            const type = KeystrokeType.system;
            const action = new KeystrokeAction();
            action.type = type;
            action.scancode = 125;
            assert.strictEqual(action.type, type);
        });

        it('should not change the "type" when is "shortMedia" if scancode < 256', ({ assert }) => {
            const type = KeystrokeType.shortMedia;
            const action = new KeystrokeAction();
            action.type = type;
            action.scancode = 125;
            assert.strictEqual(action.type, type);
        });

        it('should not change the "type" to "shortMedia" when is "longMedia" if scancode < 256', ({ assert }) => {
            const action = new KeystrokeAction();
            action.type = KeystrokeType.longMedia as any;
            action.scancode = 125;
            assert.strictEqual(action.type, KeystrokeType.shortMedia);
        });

        it('should not change the "type" when is "longMedia" if scancode >= 256', ({ assert }) => {
            const type = KeystrokeType.longMedia;
            const action = new KeystrokeAction();
            action.type = type;
            action.scancode = 256;
            assert.strictEqual(action.type, type);
        });

        it('should not change the "type" to "longMedia" when is "shortMedia" if scancode >= 256', ({ assert }) => {
            const action = new KeystrokeAction();
            action.type = KeystrokeType.shortMedia as any;
            action.scancode = 256;
            assert.strictEqual(action.type, KeystrokeType.longMedia);
        });
    });

    describe('modifierMask', () => {
        it('should store the value without modification', ({ assert }) => {
            const value = 100;
            const action = new KeystrokeAction();
            action.modifierMask = value;
            assert.strictEqual(action.modifierMask, value);
        });

        it('should throw an error when value < 0', ({ assert }) => {
            const value = -1;

            function test() {
                const action = new KeystrokeAction();
                action.modifierMask = value;
            }

            assert.throws(test, /KeystrokeAction.modifierMask: Integer -1 is outside the valid \[0, 255] interval/);
        });

        it('should throw an error when value > 255', ({ assert }) => {
            const value = 256;

            function test() {
                const action = new KeystrokeAction();
                action.modifierMask = value;
            }

            assert.throws(test, /KeystrokeAction.modifierMask: Integer 256 is outside the valid \[0, 255] interval/);
        });
    });

    describe('secondaryRoleAction', () => {
        it('should store the value without modification', ({ assert }) => {
            const value = SecondaryRoleAction.leftAlt;
            const action = new KeystrokeAction();
            action.secondaryRoleAction = value;
            assert.strictEqual(action.secondaryRoleAction, value);
        });
    });

    describe('type', () => {
        it('should not change the value if value "basic"', ({ assert }) => {
            const value = KeystrokeType.basic;
            const scancode = 200;
            const action = new KeystrokeAction();
            action.scancode = scancode;
            action.type = value;
            assert.strictEqual(action.type, value);
            assert.strictEqual(action.scancode, scancode);
        });

        it('should not change the value if value "system"', ({ assert }) => {
            const value = KeystrokeType.system;
            const scancode = 200;
            const action = new KeystrokeAction();
            action.scancode = scancode;
            action.type = value;
            assert.strictEqual(action.type, value);
            assert.strictEqual(action.scancode, scancode);
        });

        it('should not change the value if scancode >= 256 and value "longMedia"', ({ assert }) => {
            const value = KeystrokeType.longMedia;
            const scancode = 256;
            const action = new KeystrokeAction();
            action.scancode = scancode;
            action.type = value;
            assert.strictEqual(action.type, value);
            assert.strictEqual(action.scancode, scancode);
        });

        it('should change the value to "longMedia" if scancode >= 256 and value "shortMedia"', ({ assert }) => {
            const value = KeystrokeType.shortMedia as any;
            const scancode = 256;
            const action = new KeystrokeAction();
            action.scancode = scancode;
            action.type = value;
            assert.strictEqual(action.type, KeystrokeType.longMedia);
            assert.strictEqual(action.scancode, scancode);
        });

        it('should not change the value if scancode < 256 and value "shortMedia"', ({ assert }) => {
            const value = KeystrokeType.shortMedia;
            const scancode = 100;
            const action = new KeystrokeAction();
            action.scancode = scancode;
            action.type = value;
            assert.strictEqual(action.type, value);
            assert.strictEqual(action.scancode, scancode);
        });

        it('should change the value to "shortMedia" if scancode < 256 and value "longMedia"', ({ assert }) => {
            const value = KeystrokeType.longMedia as any;
            const scancode = 100;
            const action = new KeystrokeAction();
            action.scancode = scancode;
            action.type = value;
            assert.strictEqual(action.type, KeystrokeType.shortMedia);
            assert.strictEqual(action.scancode, scancode);
        });
    });

    describe('fromJsonObject', () => {
        it('should map "basic" type', ({ assert }) => {
            const jsObject = {
                keyActionType: 'keystroke',
                type: 'basic',
                scancode: 100,
                modifierMask: 10,
                secondaryRoleAction: 'leftAlt'
            };
            const action = new KeystrokeAction();
            action.fromJsonObject(jsObject, DEFAULT_SERIALISATION_INFO);

            const expected = new KeystrokeAction();
            expected.type = KeystrokeType.basic;
            expected.scancode = 100;
            expected.modifierMask = 10;
            expected.secondaryRoleAction = SecondaryRoleAction.leftAlt;

            assert.deepStrictEqual(action, expected);
        });

        it('should map "system" type', ({ assert }) => {
            const jsObject = {
                keyActionType: 'keystroke',
                type: 'system',
                scancode: 100,
                modifierMask: 10,
                secondaryRoleAction: 'leftAlt'
            };
            const action = new KeystrokeAction();
            action.fromJsonObject(jsObject, DEFAULT_SERIALISATION_INFO);

            const expected = new KeystrokeAction();
            expected.type = KeystrokeType.system;
            expected.scancode = 100;
            expected.modifierMask = 10;
            expected.secondaryRoleAction = SecondaryRoleAction.leftAlt;

            assert.deepStrictEqual(action, expected);
        });

        it.skip('should map "media" type to "shortMedia" if scancode < 256', ({ assert }) => {
            const jsObject = {
                keyActionType: 'keystroke',
                type: 'media',
                scancode: 100,
                modifierMask: 10,
                secondaryRoleAction: 'leftAlt'
            };
            const action = new KeystrokeAction();
            action.fromJsonObject(jsObject, DEFAULT_SERIALISATION_INFO);

            const expected = new KeystrokeAction();
            expected.type = KeystrokeType.shortMedia;
            expected.scancode = 100;
            expected.modifierMask = 10;
            expected.secondaryRoleAction = SecondaryRoleAction.leftAlt;

            assert.deepStrictEqual(action, expected);
        });

        it('should map "media" type to "longMedia" if scancode <= 256', ({ assert }) => {
            const jsObject = {
                keyActionType: 'keystroke',
                type: 'media',
                scancode: 256,
                modifierMask: 10,
                secondaryRoleAction: 'leftAlt'
            };
            const action = new KeystrokeAction();
            action.fromJsonObject(jsObject, DEFAULT_SERIALISATION_INFO);

            const expected = new KeystrokeAction();
            expected.type = KeystrokeType.longMedia;
            expected.scancode = 256;
            expected.modifierMask = 10;
            expected.secondaryRoleAction = SecondaryRoleAction.leftAlt;

            assert.deepStrictEqual(action, expected);
        });
    });

});
