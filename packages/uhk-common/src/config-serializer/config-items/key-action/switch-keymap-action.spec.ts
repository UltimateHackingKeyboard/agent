import { binaryDefaultHelper, jsonDefaultHelper } from '../../../../test/serializer-test-helper';
import { SwitchKeymapAction } from './switch-keymap-action';

// TODO: Add null, undefined, empty object, empty buffer test cases
fdescribe('switch-keymap-action', () => {
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
        it('should return with "PlayMacroAction"', () => {
            const action = new SwitchKeymapAction();
            expect(action.getName()).toEqual('SwitchKeymapAction');
        });
    });

    describe('full serialization', () => {
        it('should json match', () => {
            const action = new SwitchKeymapAction('AB1');
            jsonDefaultHelper(action, null, userConfiguration);
        });

        it('should binary match', () => {
            const action = new SwitchKeymapAction('AB1');
            binaryDefaultHelper(action, userConfiguration, userConfiguration);
        });
    });
});
