import { KeystrokeAction } from './keystroke-action';
import { KeystrokeType } from './keystroke-type';
import { SecondaryRoleAction } from '../secondary-role-action';

describe('keystroke-action', () => {
    it('should be instantiate', () => {
        const action = new KeystrokeAction();
        expect(action).toBeTruthy();
    });

    it('Should be inherit from other KeyStroke', () => {
        const other = new KeystrokeAction();
        other.type = KeystrokeType.basic;
        other.scancode = 125;
        other.modifierMask = 1;
        other.secondaryRoleAction = SecondaryRoleAction.leftAlt;
        const action = new KeystrokeAction(other);
        expect(action).toEqual(other);
    });

    describe('set scancode', () => {
        it('should store the value without modification', () => {
            const value = 125;
            const action = new KeystrokeAction();
            action.scancode = value;
            expect(action.scancode).toEqual(value);
        });

        it('should not change the "type" when is "basic"', () => {
            const type = KeystrokeType.basic;
            const action = new KeystrokeAction();
            action.type = type;
            action.scancode = 125;
            expect(action.type).toEqual(type);
        });

        it('should not change the "type" when is "system"', () => {
            const type = KeystrokeType.system;
            const action = new KeystrokeAction();
            action.type = type;
            action.scancode = 125;
            expect(action.type).toEqual(type);
        });

        it('should not change the "type" when is "shortMedia" if scancode < 256', () => {
            const type = KeystrokeType.shortMedia;
            const action = new KeystrokeAction();
            action.type = type;
            action.scancode = 125;
            expect(action.type).toEqual(type);
        });

        it('should not change the "type" to "shortMedia" when is "longMedia" if scancode < 256', () => {
            const action = new KeystrokeAction();
            action.type = KeystrokeType.longMedia;
            action.scancode = 125;
            expect(action.type).toEqual(KeystrokeType.shortMedia);
        });

        it('should not change the "type" when is "longMedia" if scancode >= 256', () => {
            const type = KeystrokeType.longMedia;
            const action = new KeystrokeAction();
            action.type = type;
            action.scancode = 256;
            expect(action.type).toEqual(type);
        });

        it('should not change the "type" to "longMedia" when is "shortMedia" if scancode >= 256', () => {
            const action = new KeystrokeAction();
            action.type = KeystrokeType.shortMedia;
            action.scancode = 256;
            expect(action.type).toEqual(KeystrokeType.longMedia);
        });
    });

    describe('modifierMask', () => {
        it('should store the value without modification', () => {
            const value = 100;
            const action = new KeystrokeAction();
            action.modifierMask = value;
            expect(action.modifierMask).toEqual(value);
        });

        it('should throw an error when value < 0', () => {
            const value = -1;

            function test() {
                const action = new KeystrokeAction();
                action.modifierMask = value;
            }

            expect(test).toThrow(`KeystrokeAction.modifierMask: Integer ${value} is outside the valid [0, 255] interval`);
        });

        it('should throw an error when value > 255', () => {
            const value = 256;

            function test() {
                const action = new KeystrokeAction();
                action.modifierMask = value;
            }

            expect(test).toThrow(`KeystrokeAction.modifierMask: Integer ${value} is outside the valid [0, 255] interval`);
        });
    });

    describe('secondaryRoleAction', () => {
        it('should store the value without modification', () => {
            const value = SecondaryRoleAction.leftAlt;
            const action = new KeystrokeAction();
            action.secondaryRoleAction = value;
            expect(action.secondaryRoleAction).toEqual(value);
        });
    });

    describe('type', () => {
        it('should not change the value if value "basic"', () => {
            const value = KeystrokeType.basic;
            const scancode = 200;
            const action = new KeystrokeAction();
            action.scancode = scancode;
            action.type = value;
            expect(action.type).toEqual(value);
            expect(action.scancode).toEqual(scancode);
        });

        it('should not change the value if value "system"', () => {
            const value = KeystrokeType.system;
            const scancode = 200;
            const action = new KeystrokeAction();
            action.scancode = scancode;
            action.type = value;
            expect(action.type).toEqual(value);
            expect(action.scancode).toEqual(scancode);
        });

        it('should not change the value if scancode >= 256 and value "longMedia"', () => {
            const value = KeystrokeType.longMedia;
            const scancode = 256;
            const action = new KeystrokeAction();
            action.scancode = scancode;
            action.type = value;
            expect(action.type).toEqual(value);
            expect(action.scancode).toEqual(scancode);
        });

        it('should change the value to "longMedia" if scancode >= 256 and value "shortMedia"', () => {
            const value = KeystrokeType.shortMedia;
            const scancode = 256;
            const action = new KeystrokeAction();
            action.scancode = scancode;
            action.type = value;
            expect(action.type).toEqual(KeystrokeType.longMedia);
            expect(action.scancode).toEqual(scancode);
        });

        it('should not change the value if scancode < 256 and value "shortMedia"', () => {
            const value = KeystrokeType.shortMedia;
            const scancode = 100;
            const action = new KeystrokeAction();
            action.scancode = scancode;
            action.type = value;
            expect(action.type).toEqual(value);
            expect(action.scancode).toEqual(scancode);
        });

        it('should change the value to "shortMedia" if scancode < 256 and value "longMedia"', () => {
            const value = KeystrokeType.longMedia;
            const scancode = 100;
            const action = new KeystrokeAction();
            action.scancode = scancode;
            action.type = value;
            expect(action.type).toEqual(KeystrokeType.shortMedia);
            expect(action.scancode).toEqual(scancode);
        });
    });

    describe('fromJsonObject', () => {
        it('should map "basic" type', () => {
            const jsObject = {
                keyActionType: 'keystroke',
                type: 'basic',
                scancode: 100,
                modifierMask: 10,
                secondaryRoleAction: 'leftAlt'
            };
            const action = new KeystrokeAction();
            action.fromJsonObject(jsObject);

            const expected = new KeystrokeAction();
            expected.type = KeystrokeType.basic;
            expected.scancode = 100;
            expected.modifierMask = 10;
            expected.secondaryRoleAction = SecondaryRoleAction.leftAlt;

            expect(action).toEqual(expected);
        });

        it('should map "system" type', () => {
            const jsObject = {
                keyActionType: 'keystroke',
                type: 'system',
                scancode: 100,
                modifierMask: 10,
                secondaryRoleAction: 'leftAlt'
            };
            const action = new KeystrokeAction();
            action.fromJsonObject(jsObject);

            const expected = new KeystrokeAction();
            expected.type = KeystrokeType.system;
            expected.scancode = 100;
            expected.modifierMask = 10;
            expected.secondaryRoleAction = SecondaryRoleAction.leftAlt;

            expect(action).toEqual(expected);
        });

        xit('should map "media" type to "shortMedia" if scancode < 256', () => {
            const jsObject = {
                keyActionType: 'keystroke',
                type: 'media',
                scancode: 100,
                modifierMask: 10,
                secondaryRoleAction: 'leftAlt'
            };
            const action = new KeystrokeAction();
            action.fromJsonObject(jsObject);

            const expected = new KeystrokeAction();
            expected.type = KeystrokeType.shortMedia;
            expected.scancode = 100;
            expected.modifierMask = 10;
            expected.secondaryRoleAction = SecondaryRoleAction.leftAlt;

            expect(action).toEqual(expected);
        });

        it('should map "media" type to "longMedia" if scancode <= 256', () => {
            const jsObject = {
                keyActionType: 'keystroke',
                type: 'media',
                scancode: 256,
                modifierMask: 10,
                secondaryRoleAction: 'leftAlt'
            };
            const action = new KeystrokeAction();
            action.fromJsonObject(jsObject);

            const expected = new KeystrokeAction();
            expected.type = KeystrokeType.longMedia;
            expected.scancode = 256;
            expected.modifierMask = 10;
            expected.secondaryRoleAction = SecondaryRoleAction.leftAlt;

            expect(action).toEqual(expected);
        });
    });

    describe('fromBinary', () => {

    });

    describe('toJsonObject', () => {

    });

    describe('toBinary', () => {

    });

    describe('toString', () => {

    });

    describe('isActive', () => {

    });

    describe('hasActiveModifier', () => {

    });

    describe('hasSecondaryRoleAction', () => {

    });

    describe('hasScancode', () => {

    });

    describe('hasOnlyOneActiveModifier', () => {

    });

    describe('getModifierList', () => {

    });

    describe('getName', () => {

    });
});
