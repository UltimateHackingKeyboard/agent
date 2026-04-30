import { describe, it } from 'node:test';

import { binaryDefaultHelper, jsonDefaultHelper } from '../../../../test/serializer-test-helper.js';
import { DEFAULT_SERIALISATION_INFO } from '../serialisation-info.js';
import { SwitchLayerAction, SwitchLayerMode } from './switch-layer-action.js';
import { keyActionType } from './key-action.js';

// TODO: Add null, undefined, empty object, empty buffer test cases
describe('switch-layer-action', () => {
    const action = new SwitchLayerAction(<SwitchLayerAction>{layer: 0, switchLayerMode: SwitchLayerMode.hold});

    it('should be instantiate', ({ assert }) => {
        assert.ok(new SwitchLayerAction());
    });

    describe('toString', () => {
        it('should return <SwitchLayerAction layer="0" switchLayerMode="hold">', ({ assert }) => {
            assert.strictEqual(action.toString(), '<SwitchLayerAction layer="0" switchLayerMode="hold">');
        });
    });

    describe('getName', () => {
        it('should return with "SwitchLayerAction"', ({ assert }) => {
            assert.strictEqual(action.getName(), 'SwitchLayerAction');
        });
    });

    describe('full serialization', () => {
        it('should json match', ({ assert }) => {
            jsonDefaultHelper(assert, action, DEFAULT_SERIALISATION_INFO);
        });

        it('should binary match', ({ assert }) => {
            binaryDefaultHelper(assert, action, DEFAULT_SERIALISATION_INFO);
        });
    });

    describe('backward compatibility of the "toggle" property ', () => {
        it('should map toggle=false to SwitchLayerMode.holdAndDoubleTapToggle', ({ assert }) => {
            const oldAction = new SwitchLayerAction();
            oldAction.fromJsonObject({keyActionType: keyActionType.SwitchLayerAction, layer: 0, toggle: false}, DEFAULT_SERIALISATION_INFO);

            assert.strictEqual(oldAction.switchLayerMode, SwitchLayerMode.holdAndDoubleTapToggle);
        });

        it('should map toggle=true to SwitchLayerMode.toggle', ({ assert}) => {
            const oldAction = new SwitchLayerAction();
            oldAction.fromJsonObject({keyActionType: keyActionType.SwitchLayerAction, layer: 0, toggle: true}, DEFAULT_SERIALISATION_INFO);

            assert.strictEqual(oldAction.switchLayerMode, SwitchLayerMode.toggle);
        });
    });
});
