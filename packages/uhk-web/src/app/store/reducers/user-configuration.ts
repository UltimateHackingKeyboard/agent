import { Action } from '@ngrx/store';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';

import {
    KeyAction,
    KeyActionHelper,
    Keymap,
    Layer,
    Macro,
    Module,
    NoneAction,
    PlayMacroAction,
    SwitchLayerAction,
    UserConfiguration
} from 'uhk-common';
import { KeymapActions, MacroActions } from '../actions';
import { AppState } from '../index';
import { ActionTypes } from '../actions/user-config';
import { isValidName } from '../../util';

export const initialState: UserConfiguration = new UserConfiguration();

export function reducer(state = initialState, action: Action & { payload?: any }): UserConfiguration {
    const changedUserConfiguration: UserConfiguration = Object.assign(new UserConfiguration(), state);

    switch (action.type) {
        case ActionTypes.APPLY_USER_CONFIGURATION_FROM_FILE:
        case ActionTypes.LOAD_RESET_USER_CONFIGURATION:
        case ActionTypes.LOAD_USER_CONFIG_SUCCESS: {
            Object.assign(changedUserConfiguration, action.payload);
            changedUserConfiguration.keymaps = [...changedUserConfiguration.keymaps];
            changedUserConfiguration.keymaps.sort((first: Keymap, second: Keymap) => first.name.localeCompare(second.name));
            changedUserConfiguration.macros = [...changedUserConfiguration.macros];
            changedUserConfiguration.macros.sort((first: Macro, second: Macro) => first.name.localeCompare(second.name));
            return changedUserConfiguration;
        }

        case KeymapActions.ADD:
        case KeymapActions.DUPLICATE: {
            const newKeymap: Keymap = new Keymap(action.payload);
            newKeymap.abbreviation = generateAbbr(state.keymaps, newKeymap.abbreviation);
            newKeymap.name = generateName(state.keymaps, newKeymap.name);
            newKeymap.isDefault = (state.keymaps.length === 0);

            changedUserConfiguration.keymaps = insertItemInNameOrder(state.keymaps, newKeymap);
            break;
        }
        case KeymapActions.EDIT_NAME: {
            if (!isValidName(action.payload.name)) {
                break;
            }

            const name: string = action.payload.name.trim();
            let keymapToRename: Keymap = null;

            const duplicate = state.keymaps.some((keymap: Keymap) => {
                if (keymap.abbreviation === action.payload.abbr) {
                    keymapToRename = keymap;
                }

                return keymap.name === name && keymap.abbreviation !== action.payload.abbr;
            });

            if (duplicate) {
                break;
            }

            const newKeymap = Object.assign(new Keymap(), keymapToRename, { name });

            changedUserConfiguration.keymaps = insertItemInNameOrder(
                state.keymaps,
                newKeymap,
                keymap => keymap.abbreviation !== newKeymap.abbreviation
            );
            break;
        }
        case KeymapActions.EDIT_ABBR: {
            const abbr: string = action.payload.newAbbr.toUpperCase();

            const duplicate = state.keymaps.some((keymap: Keymap) => {
                return keymap.name !== action.payload.name && keymap.abbreviation === abbr;
            });

            changedUserConfiguration.keymaps = state.keymaps.map((keymap: Keymap) => {
                keymap = Object.assign(new Keymap(), keymap);
                if (!duplicate && keymap.abbreviation === action.payload.abbr) {
                    keymap.abbreviation = abbr;
                } else {
                    keymap = keymap.renameKeymap(action.payload.abbr, action.payload.newAbbr);
                }

                return keymap;
            });
            break;
        }

        case KeymapActions.SET_DEFAULT:
            changedUserConfiguration.keymaps = state.keymaps.map((keymap: Keymap) => {
                if (keymap.abbreviation === action.payload || keymap.isDefault) {
                    keymap = Object.assign(new Keymap(), keymap);
                    keymap.isDefault = keymap.abbreviation === action.payload;
                }

                return keymap;
            });
            break;
        case KeymapActions.REMOVE:
            let isDefault: boolean;

            const filtered: Keymap[] = state.keymaps.filter((keymap: Keymap) => {
                if (keymap.abbreviation === action.payload) {
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
            changedUserConfiguration.keymaps = filtered.map(keymap => {
                keymap = Object.assign(new Keymap(), keymap);
                keymap.layers = checkExistence(keymap.layers, 'keymapAbbreviation', action.payload);

                return keymap;
            });
            break;

        case KeymapActions.SAVE_KEY: {
            const keyIndex: number = action.payload.key;
            const layerIndex: number = action.payload.layer;
            const moduleIndex: number = action.payload.module;
            const newKeyAction = KeyActionHelper.createKeyAction(action.payload.keyAction);
            const newKeymap: Keymap = Object.assign(new Keymap(), action.payload.keymap);
            newKeymap.layers = newKeymap.layers.slice();

            newKeymap.layers = newKeymap.layers.map((layer, index) => {
                const newLayer = Object.assign(new Layer(), layer);

                if (index === layerIndex) {
                    setKeyActionToLayer(newLayer, moduleIndex, keyIndex, newKeyAction);
                }
                // If the key action is a SwitchLayerAction then set the same SwitchLayerAction
                // on the target layer
                else if (newKeyAction instanceof SwitchLayerAction) {
                    if (index - 1 === newKeyAction.layer) {
                        const clonedAction = KeyActionHelper.createKeyAction(action.payload.keyAction);
                        setKeyActionToLayer(newLayer, moduleIndex, keyIndex, clonedAction);
                    } else {
                        setKeyActionToLayer(newLayer, moduleIndex, keyIndex, null);
                    }
                }
                return newLayer;
            });

            changedUserConfiguration.keymaps = state.keymaps.map(keymap => {
                if (keymap.abbreviation === newKeymap.abbreviation) {
                    keymap = newKeymap;
                }

                return keymap;
            });
            break;
        }
        case KeymapActions.CHECK_MACRO:
            changedUserConfiguration.keymaps = state.keymaps.map(keymap => {
                keymap = Object.assign(new Keymap(), keymap);
                keymap.layers = checkExistence(keymap.layers, '_macroId', action.payload);
                return keymap;
            });
            break;
        case MacroActions.ADD: {
            const newMacro = new Macro();
            newMacro.id = generateMacroId(state.macros);
            newMacro.name = generateName(state.macros, 'New macro');
            newMacro.isLooped = false;
            newMacro.isPrivate = true;
            newMacro.macroActions = [];

            changedUserConfiguration.macros = insertItemInNameOrder(state.macros, newMacro);
            break;
        }
        case MacroActions.DUPLICATE: {
            const newMacro = new Macro(action.payload);
            newMacro.name = generateName(state.macros, newMacro.name);
            newMacro.id = generateMacroId(state.macros);

            changedUserConfiguration.macros = insertItemInNameOrder(state.macros, newMacro);
            break;
        }
        case MacroActions.EDIT_NAME: {
            if (!isValidName(action.payload.name)) {
                break;
            }

            const name: string = action.payload.name.trim();
            let macroToRename: Macro = null;

            const duplicate = state.macros.some((macro: Macro) => {
                if (macro.id === action.payload.id) {
                   macroToRename = macro;
                }

                return macro.id !== action.payload.id && macro.name === name;
            });

            if (duplicate) {
                break;
            }

            const newMacro = Object.assign(new Macro(), macroToRename, { name });
            changedUserConfiguration.macros = insertItemInNameOrder(state.macros, newMacro, macro => macro.id !== newMacro.id);
            break;
        }

        case MacroActions.REMOVE:
            const macroId = action.payload;
            changedUserConfiguration.macros = state.macros.filter((macro: Macro) => macro.id !== macroId);

            for (let k = 0; k < changedUserConfiguration.keymaps.length; k++) {
                const keymap = changedUserConfiguration.keymaps[k];
                let hasChanges = false;

                for (const layer of  keymap.layers) {
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
                    changedUserConfiguration.keymaps[k] = new Keymap(keymap);
                }
            }
            break;

        case MacroActions.ADD_ACTION:
            changedUserConfiguration.macros = state.macros.map((macro: Macro) => {
                if (macro.id === action.payload.id) {
                    macro = new Macro(macro);
                    macro.macroActions.push(action.payload.action);
                }

                return macro;
            });
            break;
        case MacroActions.SAVE_ACTION:
            changedUserConfiguration.macros = state.macros.map((macro: Macro) => {
                if (macro.id === action.payload.id) {
                    macro = new Macro(macro);
                    macro.macroActions[action.payload.index] = action.payload.action;
                }

                return macro;
            });
            break;
        case MacroActions.DELETE_ACTION:
            changedUserConfiguration.macros = state.macros.map((macro: Macro) => {
                if (macro.id === action.payload.id) {
                    macro = new Macro(macro);
                    macro.macroActions.splice(action.payload.index, 1);
                }

                return macro;
            });
            break;
        case MacroActions.REORDER_ACTION:
            changedUserConfiguration.macros = state.macros.map((macro: Macro) => {
                if (macro.id === action.payload.id) {
                    let newIndex: number = action.payload.newIndex;

                    // We need to reduce the new index for one when we are moving action down
                    if (newIndex > action.payload.oldIndex) {
                        --newIndex;
                    }

                    macro = new Macro(macro);
                    macro.macroActions.splice(
                        newIndex,
                        0,
                        macro.macroActions.splice(action.payload.oldIndex, 1)[0]
                    );
                }

                return macro;
            });
            break;

        case ActionTypes.RENAME_USER_CONFIGURATION: {
            if (isValidName(action.payload)) {
                changedUserConfiguration.deviceName = action.payload.trim();
            }
            break;
        }

        case ActionTypes.SET_USER_CONFIGURATION_VALUE: {
            changedUserConfiguration[action.payload.propertyName] = action.payload.value;
            break;
        }

        case KeymapActions.EDIT_DESCRIPTION: {
            const data = (action as KeymapActions.EditDescriptionAction).payload;

            changedUserConfiguration.keymaps = state.keymaps.map(keymap => {
                if (keymap.abbreviation === data.abbr) {
                    keymap.description = data.description;
                }
                return keymap;
            });
            break;
        }

        default:
            break;
    }

    return changedUserConfiguration;
}

export function getUserConfiguration(): (state$: Observable<AppState>) => Observable<UserConfiguration> {
    return (state$: Observable<AppState>) => state$
        .map(state => state.userConfiguration);
}

export function getKeymaps(): (state$: Observable<AppState>) => Observable<Keymap[]> {
    return (state$: Observable<AppState>) => state$
        .map(state => state.userConfiguration.keymaps);
}

export function getKeymap(abbr: string) {
    if (abbr === undefined) {
        return getDefaultKeymap();
    }

    return (state$: Observable<AppState>) => getKeymaps()(state$)
        .map((keymaps: Keymap[]) =>
            keymaps.find((keymap: Keymap) => keymap.abbreviation === abbr)
        );
}

export function getDefaultKeymap() {
    return (state$: Observable<AppState>) => getKeymaps()(state$)
        .map((keymaps: Keymap[]) =>
            keymaps.find((keymap: Keymap) => keymap.isDefault)
        );
}

export function getMacros(): (state$: Observable<AppState>) => Observable<Macro[]> {
    return (state$: Observable<AppState>) => state$
        .map(state => state.userConfiguration.macros);
}

export function getMacro(id: number) {
    if (isNaN(id)) {
        return () => Observable.of<Macro>(undefined);
    } else {
        return (state$: Observable<AppState>) => getMacros()(state$)
            .map((macros: Macro[]) => macros.find((macro: Macro) => macro.id === id));
    }
}

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
