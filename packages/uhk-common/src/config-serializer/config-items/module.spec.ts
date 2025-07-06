import { UhkBuffer } from '../uhk-buffer.js';
import { KeyActionId } from './key-action/key-action.js';
import { NoneAction } from './key-action/none-action.js';
import { Module } from './module.js';
import { DEFAULT_SERIALISATION_INFO } from './serialisation-info.js';
import { UserConfiguration } from './user-configuration.js';

describe('module', () => {
    it('should be instantiate', () => {
        const module = new Module();
        expect(module).toBeTruthy();
    })

    it('should not compress 1 NoneAction', () => {
        const module = new Module();
        module.id = 1;
        module.keyActions = [
            new NoneAction(),
        ];

        const buffer = new UhkBuffer();
        module.toBinary(buffer, DEFAULT_SERIALISATION_INFO, new UserConfiguration());

        const expected = new UhkBuffer();
        expected.writeUInt8(1); // module id
        expected.writeUInt8(1); // keyActions array length
        expected.writeUInt8(KeyActionId.NoneAction);

        expect(buffer).toEqual(expected);
    })

    it ('should compress 2 NoneAction', () => {
        const module = new Module();
        module.id = 1;
        module.keyActions = [
            new NoneAction(),
            new NoneAction(),
        ];

        const buffer = new UhkBuffer();
        module.toBinary(buffer, DEFAULT_SERIALISATION_INFO, new UserConfiguration());

        const expected = new UhkBuffer();
        expected.writeUInt8(1) // moduleId
        expected.writeUInt8(2) // keyActions array length
        expected.writeUInt8(KeyActionId.NoneBlockAction);
        expected.writeUInt8(2);

        expect(buffer).toEqual(expected)
    })

    it ('should compress 2 NoneAction with per key backlighting', () => {
        const noneAction1 = new NoneAction();
        noneAction1.r = 1
        noneAction1.g = 2
        noneAction1.b = 3

        const noneAction2 = new NoneAction();
        noneAction2.r = 1
        noneAction2.g = 2
        noneAction2.b = 3

        const module = new Module();
        module.id = 1;

        module.keyActions = [
            noneAction1,
            noneAction2,
        ];

        const buffer = new UhkBuffer();
        const serialisationInfo = {
            ...DEFAULT_SERIALISATION_INFO,
            isUserConfigContainsRgbColors: true,
        };
        module.toBinary(buffer, serialisationInfo, new UserConfiguration());

        const expected = new UhkBuffer();
        expected.writeUInt8(1) // moduleId
        expected.writeUInt8(2) // keyActions array length
        expected.writeUInt8(KeyActionId.NoneBlockAction);
        expected.writeUInt8(2); // blockCount
        expected.writeUInt8(1); // red color
        expected.writeUInt8(2); // green color
        expected.writeUInt8(3); // blue color

        expect(buffer).toEqual(expected)
    })
})
