import { describe, it } from 'node:test';

import {
    KeystrokeAction,
    LayerName,
    Macro,
    NoneAction,
    PlayMacroAction,
    SecondaryRoleAction,
    SwitchLayerAction,
} from 'uhk-common';

import {
    buildKeyAccessibleLabel,
    combinePhysicalAndActionLabel,
    KeyAccessibleLabelMapper,
} from './build-key-accessible-label.js';

function createMapper(): KeyAccessibleLabelMapper {
    return {
        scanCodeToText(scanCode: number): string[] {
            if (scanCode === 4) {
                return ['A'];
            }

            if (scanCode === 82) {
                return ['Up Arrow'];
            }

            if (scanCode === 90) {
                return ['Np 2', 'icon-kbd__mod--arrow-down'];
            }

            return [`B${scanCode}`];
        },
        getSecondaryRoleText(secondaryRoleAction: SecondaryRoleAction): string {
            if (secondaryRoleAction === SecondaryRoleAction.mod) {
                return 'Mod';
            }

            return 'unknown';
        },
    };
}

describe('combinePhysicalAndActionLabel', () => {
    it('appends unassigned when the key has no action', ({ assert }) => {
        assert.equal(combinePhysicalAndActionLabel('Up Arrow', 'unassigned'), 'Up Arrow, unassigned');
    });

    it('returns only the physical name when it matches the action', ({ assert }) => {
        assert.equal(combinePhysicalAndActionLabel('Up Arrow', 'Up Arrow'), 'Up Arrow');
    });

    it('includes both names when the mapping differs from the physical key', ({ assert }) => {
        assert.equal(combinePhysicalAndActionLabel('I', 'Up Arrow'), 'I, Up Arrow');
    });
});

describe('buildKeyAccessibleLabel', () => {
    const mapper = createMapper();
    const layerOptionMap = new Map([
        [LayerName.mod, { name: 'Mod' }],
    ]);

    it('labels an unmapped physical arrow so VoiceOver can search for it', ({ assert }) => {
        const label = buildKeyAccessibleLabel({
            keyAction: new NoneAction(),
            layerOptionMap,
            mapper,
            physicalKeyLabel: 'Up Arrow',
        });

        assert.equal(label, 'Up Arrow, unassigned');
    });

    it('labels a missing key action as unassigned', ({ assert }) => {
        const label = buildKeyAccessibleLabel({
            layerOptionMap,
            mapper,
            physicalKeyLabel: 'Home',
        });

        assert.equal(label, 'Home, unassigned');
    });

    it('keeps a single name when the key still performs its physical action', ({ assert }) => {
        const keyAction = new KeystrokeAction();
        keyAction.scancode = 82;

        const label = buildKeyAccessibleLabel({
            keyAction,
            layerOptionMap,
            mapper,
            physicalKeyLabel: 'Up Arrow',
        });

        assert.equal(label, 'Up Arrow');
    });

    it('includes the physical key when it is remapped to an arrow', ({ assert }) => {
        const keyAction = new KeystrokeAction();
        keyAction.scancode = 82;

        const label = buildKeyAccessibleLabel({
            keyAction,
            layerOptionMap,
            mapper,
            physicalKeyLabel: 'I',
        });

        assert.equal(label, 'I, Up Arrow');
    });

    it('omits icon filenames from scancode labels', ({ assert }) => {
        const keyAction = new KeystrokeAction();
        keyAction.scancode = 90;

        const label = buildKeyAccessibleLabel({
            keyAction,
            layerOptionMap,
            mapper,
            physicalKeyLabel: 'Np 2',
        });

        assert.equal(label, 'Np 2');
    });

    it('includes modifiers and secondary role', ({ assert }) => {
        const keyAction = new KeystrokeAction();
        keyAction.scancode = 4;
        keyAction.modifierMask = 2;
        keyAction.secondaryRoleAction = SecondaryRoleAction.mod;

        const label = buildKeyAccessibleLabel({
            keyAction,
            layerOptionMap,
            mapper,
            physicalKeyLabel: 'A',
        });

        assert.equal(label, 'A, LShift, A, secondary role Mod');
    });

    it('describes layer switch actions', ({ assert }) => {
        const keyAction = new SwitchLayerAction();
        keyAction.layer = LayerName.mod;

        const label = buildKeyAccessibleLabel({
            keyAction,
            layerOptionMap,
            mapper,
            physicalKeyLabel: 'Space',
        });

        assert.equal(label, 'Space, Switch to Mod layer');
    });

    it('describes macro playback', ({ assert }) => {
        const keyAction = new PlayMacroAction();
        keyAction.macroId = 3;
        const macro = new Macro();
        macro.name = 'Previous heading';

        const label = buildKeyAccessibleLabel({
            keyAction,
            layerOptionMap,
            macroMap: new Map([[3, macro]]),
            mapper,
            physicalKeyLabel: 'Up Arrow',
        });

        assert.equal(label, 'Up Arrow, Play macro Previous heading');
    });
});
