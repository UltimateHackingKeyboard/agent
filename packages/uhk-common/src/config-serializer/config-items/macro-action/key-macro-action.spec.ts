import { KeyMacroAction } from './key-macro-action.js';
import { binaryDefaultHelper, jsonDefaultHelper } from '../../../../test/serializer-test-helper.js';
import { MacroKeySubAction } from './macro-action.js';
import { KeystrokeType } from '../key-action/keystroke-type.js';

describe('key-macro-action', () => {
    it('should be instantiate', () => {
        const action = new KeyMacroAction();
        expect(action).toBeTruthy();
    });

    describe('full serialization', () => {
        it('should json match', () => {
            const action = new KeyMacroAction();
            action.action = MacroKeySubAction.press;
            action.type = KeystrokeType.basic;
            action.scancode = 100;
            jsonDefaultHelper(action);
        });

        it('should binary match', () => {
            const action = new KeyMacroAction();
            action.action = MacroKeySubAction.press;
            action.type = KeystrokeType.basic;
            action.scancode = 100;
            binaryDefaultHelper(action);
        });
    });
});
