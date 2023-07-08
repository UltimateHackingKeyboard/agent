import { binaryDefaultHelper, jsonDefaultHelper } from '../../../../test/serializer-test-helper.js';
import { DEFAULT_SERIALISATION_INFO } from '../serialisation-info.js';
import { SwitchLayerAction, SwitchLayerMode } from './switch-layer-action.js';
import { keyActionType } from './key-action.js';

// TODO: Add null, undefined, empty object, empty buffer test cases
describe('switch-layer-action', () => {
    const action = new SwitchLayerAction(<SwitchLayerAction>{layer: 0, switchLayerMode: SwitchLayerMode.hold});

    it('should be instantiate', () => {
        expect(new SwitchLayerAction()).toBeTruthy();
    });

    describe('toString', () => {
        it('should return <SwitchLayerAction layer="0" switchLayerMode="hold">', () => {
            expect(action.toString()).toEqual('<SwitchLayerAction layer="0" switchLayerMode="hold">');
        });
    });

    describe('getName', () => {
        it('should return with "SwitchLayerAction"', () => {
            expect(action.getName()).toEqual('SwitchLayerAction');
        });
    });

    describe('full serialization', () => {
        it('should json match', () => {
            jsonDefaultHelper(action, DEFAULT_SERIALISATION_INFO);
        });

        it('should binary match', () => {
            binaryDefaultHelper(action, DEFAULT_SERIALISATION_INFO);
        });
    });

    describe('backward compatibility of the "toggle" property ', () => {
        it('should map toggle=false to SwitchLayerMode.holdAndDoubleTapToggle', () => {
            const oldAction = new SwitchLayerAction();
            oldAction.fromJsonObject({keyActionType: keyActionType.SwitchLayerAction, layer: 0, toggle: false}, DEFAULT_SERIALISATION_INFO);

            expect(oldAction.switchLayerMode).toEqual(SwitchLayerMode.holdAndDoubleTapToggle);
        });

        it('should map toggle=true to SwitchLayerMode.toggle', () => {
            const oldAction = new SwitchLayerAction();
            oldAction.fromJsonObject({keyActionType: keyActionType.SwitchLayerAction, layer: 0, toggle: true}, DEFAULT_SERIALISATION_INFO);

            expect(oldAction.switchLayerMode).toEqual(SwitchLayerMode.toggle);
        });
    });
});
