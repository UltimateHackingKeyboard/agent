import {
    KeyAction,
    KeyActionHelper,
    Keymap,
    Layer,
    Macro,
    Module,
    NoneAction,
    PlayMacroAction,
    SwitchKeymapAction,
    SwitchLayerAction,
    UserConfiguration
} from 'uhk-common';
import * as KeymapActions from '../actions/keymap';
import * as MacroActions from '../actions/macro';
import * as UserConfig from '../actions/user-config';
import * as DeviceActions from '../actions/device';
import { isValidName } from '../../util';
import { defaultLastEditKey, LastEditedKey } from '../../models';
import { getDefaultMacMouseSpeeds, getDefaultPcMouseSpeeds } from '../../services/default-mouse-speeds';

export interface State {
    userConfiguration: UserConfiguration;
    selectedKeymapAbbr?: string;
    selectedMacroId?: number;
    lastEditedKey: LastEditedKey;
}

export const initialState: State = {
    userConfiguration: new UserConfiguration(),
    lastEditedKey: defaultLastEditKey()
};

export function reducer(
    state = initialState,
    action: KeymapActions.Actions | MacroActions.Actions | UserConfig.Actions | DeviceActions.Actions
): State {
    switch (action.type) {
        case UserConfig.ActionTypes.ApplyUserConfigurationFromFile:
        case UserConfig.ActionTypes.LoadResetUserConfiguration:
        case UserConfig.ActionTypes.LoadUserConfigSuccess: {
            const userConfig = (action as UserConfig.LoadUserConfigSuccessAction).payload;

            const userConfiguration = Object.assign(new UserConfiguration(), {
                ...state.userConfiguration,
                ...userConfig,
                keymaps: userConfig.keymaps.sort((first: Keymap, second: Keymap) => first.name.localeCompare(second.name)),
                macros: userConfig.macros.sort((first: Macro, second: Macro) => first.name.localeCompare(second.name))
            });

            return {
                ...state,
                userConfiguration
            };
        }

        case DeviceActions.ActionTypes.ResetPcMouseSpeedSettings:
            return {
                ...state,
                userConfiguration: Object.assign(
                    new UserConfiguration(),
                    {
                        ...state.userConfiguration,
                        ...getDefaultPcMouseSpeeds()
                    }
                )
            };

        case DeviceActions.ActionTypes.ResetMacMouseSpeedSettings:
            return {
                ...state,
                userConfiguration: Object.assign(
                    new UserConfiguration(),
                    {
                        ...state.userConfiguration,
                        ...getDefaultMacMouseSpeeds()
                    }
                )
            };

        case KeymapActions.ActionTypes.Add:
        case KeymapActions.ActionTypes.Duplicate: {
            const newKeymap: Keymap = new Keymap((action as KeymapActions.AddKeymapAction).payload);
            newKeymap.abbreviation = generateAbbr(state.userConfiguration.keymaps, newKeymap.abbreviation);
            newKeymap.name = generateName(state.userConfiguration.keymaps, newKeymap.name);
            newKeymap.isDefault = (state.userConfiguration.keymaps.length === 0);

            const userConfiguration: UserConfiguration = Object.assign(new UserConfiguration(), state.userConfiguration);
            userConfiguration.keymaps = insertItemInNameOrder(state.userConfiguration.keymaps, newKeymap);

            return {
                ...state,
                userConfiguration
            };
        }

        case KeymapActions.ActionTypes.EditName: {
            const payload = (action as KeymapActions.EditKeymapNameAction).payload;

            if (!isValidName(payload.name)) {
                break;
            }

            const name: string = payload.name.trim();
            let keymapToRename: Keymap = null;

            const duplicate = state.userConfiguration.keymaps.some((keymap: Keymap) => {
                if (keymap.abbreviation === payload.abbr) {
                    keymapToRename = keymap;
                }

                return keymap.name === name && keymap.abbreviation !== payload.abbr;
            });

            if (duplicate) {
                break;
            }

            const newKeymap = Object.assign(new Keymap(), keymapToRename, { name });

            const userConfiguration: UserConfiguration = Object.assign(new UserConfiguration(), state.userConfiguration);
            userConfiguration.keymaps = insertItemInNameOrder(
                state.userConfiguration.keymaps,
                newKeymap,
                keymap => keymap.abbreviation !== newKeymap.abbreviation
            );

            return {
                ...state,
                userConfiguration
            };
        }

        case KeymapActions.ActionTypes.EditAbbr: {
            const payload = (action as KeymapActions.EditKeymapAbbreviationAction).payload;
            const abbr: string = payload.newAbbr.toUpperCase();

            const duplicate = state.userConfiguration.keymaps.some((keymap: Keymap) => {
                return keymap.name !== payload.name && keymap.abbreviation === abbr;
            });

            const userConfiguration: UserConfiguration = Object.assign(new UserConfiguration(), state.userConfiguration);
            userConfiguration.keymaps = state.userConfiguration.keymaps.map((keymap: Keymap) => {
                keymap = Object.assign(new Keymap(), keymap);
                if (!duplicate && keymap.abbreviation === payload.abbr) {
                    keymap.abbreviation = abbr;
                } else {
                    keymap = keymap.renameKeymap(payload.abbr, payload.newAbbr);
                }

                return keymap;
            });

            return {
                ...state,
                userConfiguration
            };
        }

        case KeymapActions.ActionTypes.SetDefault: {
            const payload = (action as KeymapActions.SetDefaultKeymapAction).payload;
            const userConfiguration: UserConfiguration = Object.assign(new UserConfiguration(), state.userConfiguration);
            userConfiguration.keymaps = state.userConfiguration.keymaps.map((keymap: Keymap) => {
                if (keymap.abbreviation === payload || keymap.isDefault) {
                    keymap = Object.assign(new Keymap(), keymap);
                    keymap.isDefault = keymap.abbreviation === payload;
                }

                return keymap;
            });

            return {
                ...state,
                userConfiguration
            };
        }

        case KeymapActions.ActionTypes.Remove: {
            const payload = (action as KeymapActions.RemoveKeymapAction).payload;

            let isDefault: boolean;

            const filtered: Keymap[] = state.userConfiguration.keymaps.filter((keymap: Keymap) => {
                if (keymap.abbreviation === payload) {
                    isDefault = keymap.isDefault;
                    return false;
                }

                return true;
            });

            // If deleted one is default set default keymap to the first on the list of keymaps
            if (isDefault && filtered.length > 0) {
                filtered[0] = Object.assign(new Keymap(), filtered[0], {
                    isDefault: true
                });
            }

            // Check for the deleted keymap in other keymaps
            const userConfiguration: UserConfiguration = Object.assign(new UserConfiguration(), state.userConfiguration);
            userConfiguration.keymaps = filtered.map(keymap => {
                keymap = Object.assign(new Keymap(), keymap);
                keymap.layers = checkExistence(keymap.layers, 'keymapAbbreviation', payload);

                return keymap;
            });

            return {
                ...state,
                userConfiguration
            };
        }

        case KeymapActions.ActionTypes.SaveKey: {
            const payload = (action as KeymapActions.SaveKeyAction).payload;
            const keyIndex: number = payload.key;
            const layerIndex: number = payload.layer;
            const moduleIndex: number = payload.module;
            const keyActionRemap = payload.keyAction;
            const newKeyAction = keyActionRemap.action;
            const newKeymap: Keymap = payload.keymap;
            const isSwitchLayerAction = newKeyAction instanceof SwitchLayerAction;
            const isSwitchKeymapAction = newKeyAction instanceof SwitchKeymapAction;
            const oldKeyAction = newKeymap.layers[layerIndex].modules[moduleIndex].keyActions[keyIndex];
            const oldKeyIsSwitchLayerAction = oldKeyAction instanceof SwitchLayerAction;

            const userConfiguration: UserConfiguration = Object.assign(new UserConfiguration(), state.userConfiguration);
            userConfiguration.keymaps = state.userConfiguration.keymaps.map(keymap => {
                // SwitchKeymapAction not allow to refer to itself
                if (isSwitchKeymapAction && keymap.abbreviation === (newKeyAction as any).keymapAbbreviation) {
                    return keymap;
                }

                if (keyActionRemap.remapOnAllKeymap || keymap.abbreviation === newKeymap.abbreviation) {
                    keymap.layers = keymap.layers.map((layer, index) => {
                        if (keyActionRemap.remapOnAllLayer || index === layerIndex || isSwitchLayerAction) {
                            const clonedAction = KeyActionHelper.createKeyAction(newKeyAction);

                            // If the key action is a SwitchLayerAction then set the same SwitchLayerAction
                            // on the target layer and remove SwitchLayerAction from other layers
                            if (isSwitchLayerAction) {
                                if (index === 0 || index - 1 === (newKeyAction as SwitchLayerAction).layer) {
                                    setKeyActionToLayer(layer, moduleIndex, keyIndex, clonedAction);
                                } else {
                                    const actionOnLayer = layer.modules[moduleIndex].keyActions[keyIndex];
                                    if (actionOnLayer && actionOnLayer instanceof SwitchLayerAction) {
                                        setKeyActionToLayer(layer, moduleIndex, keyIndex, null);
                                    }
                                }
                            } else {
                                setKeyActionToLayer(layer, moduleIndex, keyIndex, clonedAction);
                            }
                        } else if (oldKeyIsSwitchLayerAction && index - 1 === (oldKeyAction as SwitchLayerAction).layer) {
                            setKeyActionToLayer(layer, moduleIndex, keyIndex, null);
                        }

                        return layer;
                    });
                }

                return keymap;
            });

            return {
                ...state,
                userConfiguration,
                lastEditedKey: {
                    key: 'key-' + (keyIndex + 1),
                    moduleId: moduleIndex
                }
            };
        }

        case KeymapActions.ActionTypes.CheckMacro: {
            const payload = (action as KeymapActions.CheckMacroAction).payload;

            const userConfiguration: UserConfiguration = Object.assign(new UserConfiguration(), state.userConfiguration);
            userConfiguration.keymaps = state.userConfiguration.keymaps.map(keymap => {
                keymap = Object.assign(new Keymap(), keymap);
                keymap.layers = checkExistence(keymap.layers, '_macroId', payload);
                return keymap;
            });

            return {
                ...state,
                userConfiguration
            };
        }

        case MacroActions.ActionTypes.Add: {
            const newMacro = new Macro();
            newMacro.id = generateMacroId(state.userConfiguration.macros);
            newMacro.name = generateName(state.userConfiguration.macros, 'New macro');
            newMacro.isLooped = false;
            newMacro.isPrivate = true;
            newMacro.macroActions = [];

            const userConfiguration: UserConfiguration = Object.assign(new UserConfiguration(), state.userConfiguration);
            userConfiguration.macros = insertItemInNameOrder(state.userConfiguration.macros, newMacro);

            return {
                ...state,
                userConfiguration
            };
        }

        case MacroActions.ActionTypes.Duplicate: {
            const payload = (action as MacroActions.DuplicateMacroAction).payload;
            const newMacro = new Macro(payload);
            newMacro.name = generateName(state.userConfiguration.macros, newMacro.name);
            newMacro.id = generateMacroId(state.userConfiguration.macros);

            const userConfiguration: UserConfiguration = Object.assign(new UserConfiguration(), state.userConfiguration);
            userConfiguration.macros = insertItemInNameOrder(state.userConfiguration.macros, newMacro);

            return {
                ...state,
                userConfiguration
            };
        }

        case MacroActions.ActionTypes.EditName: {
            const payload = (action as MacroActions.EditMacroNameAction).payload;
            if (!isValidName(payload.name)) {
                break;
            }

            const name: string = payload.name.trim();
            let macroToRename: Macro = null;

            const duplicate = state.userConfiguration.macros.some((macro: Macro) => {
                if (macro.id === payload.id) {
                    macroToRename = macro;
                }

                return macro.id !== payload.id && macro.name === name;
            });

            if (duplicate) {
                break;
            }

            const newMacro = Object.assign(new Macro(), macroToRename, { name });
            const userConfiguration: UserConfiguration = Object.assign(new UserConfiguration(), state.userConfiguration);
            userConfiguration.macros = insertItemInNameOrder(
                state.userConfiguration.macros,
                newMacro,
                macro => macro.id !== newMacro.id);

            return {
                ...state,
                userConfiguration
            };
        }

        case MacroActions.ActionTypes.Remove: {
            const macroId = (action as MacroActions.RemoveMacroAction).payload;
            const userConfiguration: UserConfiguration = Object.assign(new UserConfiguration(), state.userConfiguration);
            userConfiguration.macros = state.userConfiguration.macros.filter((macro: Macro) => macro.id !== macroId);

            for (let k = 0; k < userConfiguration.keymaps.length; k++) {
                const keymap = userConfiguration.keymaps[k];
                let hasChanges = false;

                for (const layer of keymap.layers) {
                    for (const module of layer.modules) {
                        for (let ka = 0; ka < module.keyActions.length; ka++) {
                            const keyAction = module.keyActions[ka];

                            if (keyAction instanceof PlayMacroAction && keyAction.macroId === macroId) {
                                hasChanges = true;
                                module.keyActions[ka] = new NoneAction();
                            }
                        }
                    }
                }

                if (hasChanges) {
                    userConfiguration.keymaps[k] = new Keymap(keymap);
                }
            }

            return {
                ...state,
                userConfiguration
            };
        }

        case MacroActions.ActionTypes.AddAction: {
            const payload = (action as MacroActions.AddMacroActionAction).payload;

            const userConfiguration: UserConfiguration = Object.assign(new UserConfiguration(), state.userConfiguration);
            userConfiguration.macros = state.userConfiguration.macros.map((macro: Macro) => {
                if (macro.id === payload.id) {
                    macro = new Macro(macro);
                    macro.macroActions.push(payload.action);
                }

                return macro;
            });

            return {
                ...state,
                userConfiguration
            };
        }

        case MacroActions.ActionTypes.SaveAction: {
            const payload = (action as MacroActions.SaveMacroActionAction).payload;
            const userConfiguration: UserConfiguration = Object.assign(new UserConfiguration(), state.userConfiguration);
            userConfiguration.macros = state.userConfiguration.macros.map((macro: Macro) => {
                if (macro.id === payload.id) {
                    macro = new Macro(macro);
                    macro.macroActions[payload.index] = payload.action;
                }

                return macro;
            });

            return {
                ...state,
                userConfiguration
            };
        }

        case MacroActions.ActionTypes.DeleteAction: {
            const payload = (action as MacroActions.DeleteMacroActionAction).payload;
            const userConfiguration: UserConfiguration = Object.assign(new UserConfiguration(), state.userConfiguration);
            userConfiguration.macros = state.userConfiguration.macros.map((macro: Macro) => {
                if (macro.id === payload.id) {
                    macro = new Macro(macro);
                    macro.macroActions.splice(payload.index, 1);
                }

                return macro;
            });

            return {
                ...state,
                userConfiguration
            };
        }

        case MacroActions.ActionTypes.ReorderAction: {
            const payload = (action as MacroActions.ReorderMacroActionAction).payload;
            const userConfiguration: UserConfiguration = Object.assign(new UserConfiguration(), state.userConfiguration);
            userConfiguration.macros = state.userConfiguration.macros.map((macro: Macro) => {
                if (macro.id === payload.id) {
                    macro = new Macro(macro);
                    macro.macroActions.splice(
                        payload.newIndex,
                        0,
                        macro.macroActions.splice(payload.oldIndex, 1)[0]
                    );
                }

                return macro;
            });

            return {
                ...state,
                userConfiguration
            };
        }

        case UserConfig.ActionTypes.RenameUserConfiguration: {
            const payload = (action as UserConfig.RenameUserConfigurationAction).payload;

            if (isValidName(payload)) {
                const userConfiguration: UserConfiguration = Object.assign(new UserConfiguration(), state.userConfiguration);
                userConfiguration.deviceName = payload.trim();

                return {
                    ...state,
                    userConfiguration
                };
            }

            return state;
        }

        case UserConfig.ActionTypes.SetUserConfigurationValue: {
            const payload = (action as UserConfig.SetUserConfigurationValueAction).payload;
            const userConfiguration: UserConfiguration = Object.assign(new UserConfiguration(), state.userConfiguration);
            userConfiguration[payload.propertyName] = payload.value;

            return {
                ...state,
                userConfiguration
            };
        }

        case KeymapActions.ActionTypes.EditDescription: {
            const data = (action as KeymapActions.EditDescriptionAction).payload;

            const userConfiguration: UserConfiguration = Object.assign(new UserConfiguration(), state.userConfiguration);
            userConfiguration.keymaps = state.userConfiguration.keymaps.map(keymap => {
                if (keymap.abbreviation === data.abbr) {
                    keymap.description = data.description;
                }
                return keymap;
            });

            return {
                ...state,
                userConfiguration
            };
        }

        case KeymapActions.ActionTypes.Select:
            return {
                ...state,
                selectedKeymapAbbr: (action as KeymapActions.SelectKeymapAction).payload,
                lastEditedKey: defaultLastEditKey()
            };

        case MacroActions.ActionTypes.Select:
            return {
                ...state,
                selectedMacroId: (action as MacroActions.SelectMacroAction).payload
            };

        default:
            return state;
    }
}

export const getUserConfiguration = (state: State): UserConfiguration => state.userConfiguration;
export const getKeymaps = (state: State): Keymap[] => state.userConfiguration.keymaps;
export const getDefaultKeymap = (state: State): Keymap => state.userConfiguration.keymaps.find(keymap => keymap.isDefault);
export const getSelectedKeymap = (state: State): Keymap => {
    if (state.selectedKeymapAbbr === undefined) {
        return getDefaultKeymap(state);
    }

    return state.userConfiguration.keymaps.find(keymap => keymap.abbreviation === state.selectedKeymapAbbr);
};
export const getMacros = (state: State): Macro[] => state.userConfiguration.macros;
export const getSelectedMacro = (state: State): Macro => {
    if (isNaN(state.selectedMacroId)) {
        return undefined;
    }

    return state.userConfiguration.macros.find(macro => macro.id === state.selectedMacroId);
};
export const isKeymapDeletable = (state: State): boolean => state.userConfiguration.keymaps.length > 1;
export const hasMacro = (state: State): boolean => state.userConfiguration.macros.length > 0;
export const reduceMacroToMap = (map: Map<number, Macro>, macro: Macro) => map.set(macro.id, macro);
export const getMacroMap = (state: State): Map<number, Macro> => {
    return state.userConfiguration.macros.reduce(reduceMacroToMap, new Map());
};
export const lastEditedKey = (state: State): LastEditedKey => state.lastEditedKey;

function generateAbbr(keymaps: Keymap[], abbr: string): string {
    const chars: string[] = '23456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    let position = 0;

    while (keymaps.some((keymap: Keymap) => keymap.abbreviation === abbr)) {
        abbr = abbr.substring(0, abbr.length - 1) + chars[position];
        ++position;
        if (position > chars.length) {
            position = 0;
            let firstCharIndex = chars.indexOf(abbr.substr(0, 1));
            let secondCharIndex = chars.indexOf(abbr.substr(1, 1));
            secondCharIndex++;

            if (secondCharIndex > chars.length) {
                secondCharIndex = 0;
                firstCharIndex++;
            }
            abbr = chars[firstCharIndex] + chars[secondCharIndex] + chars[position];
        }
    }

    return abbr;
}

function generateName(items: { name: string }[], name: string) {
    let suffix = 1;
    const regexp = / \(\d+\)$/g;
    const matchName = name.replace(regexp, '');
    items.forEach(item => {
        if (item.name.replace(regexp, '') === matchName) {
            suffix++;
        }
    });
    return `${matchName} (${suffix})`;
}

function generateMacroId(macros: Macro[]) {
    let newId = 0;

    macros.forEach((macro: Macro) => {
        if (macro.id > newId) {
            newId = macro.id;
        }
    });

    return newId + 1;
}

function insertItemInNameOrder<T extends { name: string }>(
    items: T[], newItem: T, keepItem: (item: T) => boolean = () => true
): T[] {
    const newItems: T[] = [];
    let added = false;
    for (const item of items) {
        if (!added && item.name.localeCompare(newItem.name) > 0) {
            newItems.push(newItem);
            added = true;
        }
        if (keepItem(item)) {
            newItems.push(item);
        }
    }
    if (!added) {
        newItems.push(newItem);
    }

    return newItems;
}

function checkExistence(layers: Layer[], property: string, value: any): Layer[] {
    const keyActionsToClear: {
        layerIdx: number,
        moduleIdx: number,
        keyActionIdx: number
    }[] = [];
    for (let layerIdx = 0; layerIdx < layers.length; ++layerIdx) {
        const modules = layers[layerIdx].modules;
        for (let moduleIdx = 0; moduleIdx < modules.length; ++moduleIdx) {
            const keyActions = modules[moduleIdx].keyActions;
            for (let keyActionIdx = 0; keyActionIdx < keyActions.length; ++keyActionIdx) {
                const action = keyActions[keyActionIdx];
                if (action && action.hasOwnProperty(property) && action[property] === value) {
                    keyActionsToClear.push({
                        layerIdx,
                        moduleIdx,
                        keyActionIdx
                    });
                }
            }
        }
    }
    if (keyActionsToClear.length === 0) {
        return layers;
    }

    const newLayers = [...layers];
    for (const path of keyActionsToClear) {
        if (newLayers[path.layerIdx] === layers[path.layerIdx]) {
            newLayers[path.layerIdx] = Object.assign(new Layer(), newLayers[path.layerIdx]);
            newLayers[path.layerIdx].modules = [...newLayers[path.layerIdx].modules];
        }
        const newModules = newLayers[path.layerIdx].modules;
        if (newModules[path.moduleIdx] === layers[path.layerIdx].modules[path.moduleIdx]) {
            newModules[path.moduleIdx] = Object.assign(new Module(), newModules[path.moduleIdx]);
            newModules[path.moduleIdx].keyActions = [...newModules[path.moduleIdx].keyActions];
        }
        newModules[path.moduleIdx].keyActions[path.keyActionIdx] = undefined;
    }

    return newLayers;
}

function setKeyActionToLayer(newLayer: Layer, moduleIndex: number, keyIndex: number, newKeyAction: KeyAction): void {
    const newModule: Module = Object.assign(new Module(), newLayer.modules[moduleIndex]);
    newLayer.modules = newLayer.modules.slice();
    newLayer.modules[moduleIndex] = newModule;

    newModule.keyActions = newModule.keyActions.slice();
    newModule.keyActions[keyIndex] = newKeyAction;
}
