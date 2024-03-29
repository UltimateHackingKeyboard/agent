import { binaryDefaultHelper, jsonDefaultHelper } from '../../../../test/serializer-test-helper.js';
import { DEFAULT_SERIALISATION_INFO } from '../serialisation-info.js';
import { PlayMacroAction } from './play-macro-action.js';

// TODO: Add null, undefined, empty object, empty buffer test cases
describe('play-action', () => {
    const macros = [{id: 1}, {id: 2}];
    const userConfiguration = {macros};

    it('should be instantiate', () => {
        const action = new PlayMacroAction();
        expect(action).toBeTruthy();
    });

    describe('toString', () => {
        it('should return <PlayMacroAction macroId="1">', () => {
            const action = new PlayMacroAction();
            action.macroId = 1;
            expect(action.toString()).toEqual('<PlayMacroAction macroId="1">');
        });
    });

    describe('getName', () => {
        it('should return with "PlayMacroAction"', () => {
            const action = new PlayMacroAction();
            expect(action.getName()).toEqual('PlayMacroAction');
        });
    });

    describe('full serialization', () => {
        it('should json match', () => {
            const action = new PlayMacroAction();
            action.macroId = 1;
            jsonDefaultHelper(action, DEFAULT_SERIALISATION_INFO, macros, macros);
        });

        it('should binary match', () => {
            const action = new PlayMacroAction();
            action.macroId = 1;
            binaryDefaultHelper(action, DEFAULT_SERIALISATION_INFO, userConfiguration, macros);
        });
    });
});
