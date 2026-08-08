import { describe, it } from 'node:test';

import { UhkBuffer } from '../uhk-buffer.js';
import {
    KeystrokeAction,
    KeystrokeType,
    MacroArgumentAction,
    Module,
    PlayMacroAction,
} from './index.js';
import { DEFAULT_SERIALISATION_INFO } from './serialisation-info.js';

describe('module key labels', () => {
    const macros = [{ id: 1 }];
    const serialisationInfo = DEFAULT_SERIALISATION_INFO;

    function createLabeledKeystroke(): KeystrokeAction {
        const keystrokeAction = new KeystrokeAction();
        keystrokeAction.type = KeystrokeType.basic;
        keystrokeAction.scancode = 4;
        keystrokeAction.label = 'Hello note';
        return keystrokeAction;
    }

    it('should round-trip keystroke label through json', ({ assert }) => {
        const module = new Module();
        module.id = 0;
        module.keyActions = [createLabeledKeystroke()];

        const json = module.toJsonObject(serialisationInfo, macros as any);
        const restored = new Module().fromJsonObject(json, macros as any, serialisationInfo);

        assert.strictEqual(restored.keyActions[0].label, 'Hello note');
        assert.ok(restored.keyActions[0] instanceof KeystrokeAction);
    });

    it('should round-trip keystroke label through binary', ({ assert }) => {
        const module = new Module();
        module.id = 0;
        module.keyActions = [createLabeledKeystroke()];

        const buffer = new UhkBuffer();
        module.toBinary(buffer, serialisationInfo, { macros } as any);
        buffer.offset = 0;

        const restored = new Module().fromBinary(buffer, macros as any, serialisationInfo);

        assert.strictEqual(restored.keyActions.length, 1);
        assert.strictEqual(restored.keyActions[0].label, 'Hello note');
        assert.ok(restored.keyActions[0] instanceof KeystrokeAction);
    });

    it('should keep play macro arguments and label in binary', ({ assert }) => {
        const module = new Module();
        module.id = 0;
        const playMacroAction = new PlayMacroAction();
        playMacroAction.macroId = 1;
        const macroArgument = new MacroArgumentAction();
        macroArgument.value = 'arg1';
        playMacroAction.macroArguments = [macroArgument];
        playMacroAction.label = 'Macro note';
        module.keyActions = [playMacroAction];

        const buffer = new UhkBuffer();
        module.toBinary(buffer, serialisationInfo, { macros } as any);
        buffer.offset = 0;

        const restored = new Module().fromBinary(buffer, macros as any, serialisationInfo);
        const restoredPlayMacro = restored.keyActions[0] as PlayMacroAction;

        assert.ok(restoredPlayMacro instanceof PlayMacroAction);
        assert.strictEqual(restoredPlayMacro.label, 'Macro note');
        assert.strictEqual(restoredPlayMacro.macroArguments.length, 1);
        assert.strictEqual(restoredPlayMacro.macroArguments[0].value, 'arg1');
        assert.strictEqual(module.getKeyActionsCount(), 3);
    });

    it('should omit empty labels from json', ({ assert }) => {
        const module = new Module();
        module.id = 0;
        const keystrokeAction = new KeystrokeAction();
        keystrokeAction.type = KeystrokeType.basic;
        keystrokeAction.scancode = 4;
        module.keyActions = [keystrokeAction];

        const json = module.toJsonObject(serialisationInfo, macros as any);

        assert.strictEqual(json.keyActions[0].label, undefined);
    });
});
