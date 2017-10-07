import { binaryDefaultHelper, jsonDefaultHelper } from '../../../../test/serializer-test-helper';
import { SwitchLayerAction } from './switch-layer-action';

// TODO: Add null, undefined, empty object, empty buffer test cases
describe('switch-layer-action', () => {
    const action = new SwitchLayerAction(<SwitchLayerAction>{layer: 0, isLayerToggleable: false});

    it('should be instantiate', () => {
        expect(new SwitchLayerAction()).toBeTruthy();
    });

    describe('toString', () => {
        it('should return <SwitchLayerAction layer="0" toggle="false">', () => {
            expect(action.toString()).toEqual('<SwitchLayerAction layer="0" toggle="false">');
        });
    });

    describe('getName', () => {
        it('should return with "SwitchLayerAction"', () => {
            expect(action.getName()).toEqual('SwitchLayerAction');
        });
    });

    describe('full serialization', () => {
        it('should json match', () => {
            jsonDefaultHelper(action);
        });

        it('should binary match', () => {
            binaryDefaultHelper(action);
        });
    });
});
