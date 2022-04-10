import { binaryDefaultHelper, jsonDefaultHelper } from '../../../../test/serializer-test-helper.js';
import { MouseAction, MouseActionParam } from './mouse-action.js';

// TODO: Add null, undefined, empty object, empty buffer test cases
describe('mouse-action', () => {
    it('should be instantiate', () => {
        const action = new MouseAction();
        expect(action).toBeTruthy();
    });

    describe('toString', () => {
        it(`should return with <MouseAction mouseAction="${MouseActionParam.leftClick}">`, () => {
            const action = new MouseAction();
            action.mouseAction = MouseActionParam.leftClick;
            expect(action.toString()).toEqual(`<MouseAction mouseAction="${MouseActionParam.leftClick}">`);
        });
    });

    describe('getName', () => {
        it('should return with "MouseAction"', () => {
            const action = new MouseAction();
            expect(action.getName()).toEqual('MouseAction');
        });
    });

    describe('full serialization', () => {
        it('should json match', () => {
            const action = new MouseAction();
            action.mouseAction = MouseActionParam.leftClick;
            jsonDefaultHelper(action);
        });

        it('should binary match', () => {
            const action = new MouseAction();
            action.mouseAction = MouseActionParam.leftClick;
            binaryDefaultHelper(action);
        });
    });
});
