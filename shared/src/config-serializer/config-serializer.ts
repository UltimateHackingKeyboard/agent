import { UhkBuffer } from './uhk-buffer';
import { UserConfiguration } from './config-items/user-configuration';
import { ModuleConfiguration } from './config-items/module-configuration';
import { Macro } from './config-items/macro';
import { Keymap } from './config-items/keymap';
import { Layer } from './config-items/layer';
import { Module } from './config-items/module';
import { SwitchKeymapAction, UnresolvedSwitchKeymapAction, NoneAction, KeyAction } from './config-items/key-action';

export namespace ConfigSerializer {

    export function uhkBufferToUserConfiguration(buffer: UhkBuffer): UserConfiguration {
        const userConfiguration = new UserConfiguration();
        userConfiguration.dataModelVersion = buffer.readUInt16();
        userConfiguration.moduleConfigurations = buffer.readArray<ModuleConfiguration>(uhkBuffer => {
            return new ModuleConfiguration().fromBinary(uhkBuffer);
        });
        userConfiguration.macros = buffer.readArray<Macro>((uhkBuffer, index) => {
            const macro = new Macro().fromBinary(uhkBuffer);
            macro.id = index;
            return macro;
        });
        userConfiguration.keymaps = buffer.readArray<Keymap>(uhkBuffer => {
            return new Keymap().fromBinary(uhkBuffer, userConfiguration.macros);
        });
        resolveSwitchKeymapActions(userConfiguration.keymaps);
        return userConfiguration;
    }

    export function writeUserConfiguration(userConfiguration: UserConfiguration, buffer: UhkBuffer): void {
        buffer.writeUInt16(userConfiguration.dataModelVersion);
        buffer.writeArray(userConfiguration.moduleConfigurations);
        buffer.writeArray(userConfiguration.macros);
        buffer.writeArray(userConfiguration.keymaps, (uhkBuffer: UhkBuffer, keymap: Keymap) => {
            writeKeymap(keymap, uhkBuffer, userConfiguration);
        });
    }

    export function writeKeymap(keymap: Keymap, buffer: UhkBuffer, userConfiguration: UserConfiguration) {
        buffer.writeString(keymap.abbreviation);
        buffer.writeBoolean(keymap.isDefault);
        buffer.writeString(keymap.name);
        buffer.writeString(keymap.description);
        buffer.writeArray(keymap.layers, (uhkBuffer: UhkBuffer, layer: Layer) => {
            writeLayer(layer, uhkBuffer, userConfiguration);
        });
    }

    export function writeLayer(layer: Layer, buffer: UhkBuffer, userConfiguration: UserConfiguration): void {
        buffer.writeArray(layer.modules, (uhkBuffer: UhkBuffer, module: Module) => {
            writeModule(module, uhkBuffer, userConfiguration);
        });
    }

    function writeModule(module: Module, buffer: UhkBuffer, userConfiguration: UserConfiguration): void {
        buffer.writeUInt8(module.id);
        buffer.writeUInt8(module.pointerRole);

        const noneAction = new NoneAction();

        const keyActions: KeyAction[] = module.keyActions.map(keyAction => {
            if (keyAction) {
                return keyAction;
            }
            return noneAction;
        });

        buffer.writeArray(keyActions, (uhkBuffer: UhkBuffer, keyAction: KeyAction) => {
            writeKeyAction(keyAction, uhkBuffer, userConfiguration);
        });
    }

    function writeKeyAction(
        keyAction: KeyAction,
        buffer: UhkBuffer,
        userConfiguration: UserConfiguration
    ): void {
        if (keyAction.toBinary) {
            keyAction.toBinary(buffer, userConfiguration.macros);
        } else if (keyAction instanceof SwitchKeymapAction) {
            writeSwitchKeymapAction(keyAction, buffer, userConfiguration);
        }
    }

    function writeSwitchKeymapAction(
        keyAction: SwitchKeymapAction,
        buffer: UhkBuffer,
        userConfiguration: UserConfiguration
    ): void {
        const idx = userConfiguration.keymaps.findIndex(keymap => keymap.abbreviation === keyAction.keymapAbbreviation);
        const unresolved = new UnresolvedSwitchKeymapAction(idx);
        unresolved.toBinary(buffer);
    }

    function resolveSwitchKeymapActions(keymaps: Keymap[]) {
        for (const keymap of keymaps) {
            for (const layer of keymap.layers) {
                for (const module of layer.modules) {
                    for (let i = 0; i < module.keyActions.length; ++i) {
                        const keyAction = module.keyActions[i];
                        if (keyAction instanceof UnresolvedSwitchKeymapAction) {
                            module.keyActions[i] = keyAction.resolve(keymaps);
                        }
                    }
                }
            }
        }
    }
}
