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

    it('should be instantiate', () => {
        const action = new SwitchKeymapAction();
        expect(action).toBeTruthy();
    });

    describe('toString', () => {
        it('should return <SwitchKeymapAction keymapAbbreviation="ABB">', () => {
            const action = new SwitchKeymapAction('ABB');
            expect(action.toString()).toEqual('<SwitchKeymapAction keymapAbbreviation="ABB">');
        });
    });

    describe('getName', () => {
        it('should return with "SwitchKeymapAction"', () => {
            const action = new SwitchKeymapAction();
            expect(action.getName()).toEqual('SwitchKeymapAction');
        });
    });

    describe('full serialization', () => {
        it('should json match', () => {
            const action = new SwitchKeymapAction('AB1');
            jsonDefaultHelper(action, DEFAULT_SERIALISATION_INFO);
        });

        xit('should binary match', () => {
            const action = new SwitchKeymapAction('AB1');
            binaryDefaultHelper(action, DEFAULT_SERIALISATION_INFO, userConfiguration, userConfiguration);
        });
    });
});
