import '@ngrx/core/add/operator/select';
import { Action } from '@ngrx/store';

import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

import { Helper as KeyActionHelper, KeyAction } from '../../config-serializer/config-items/key-action';
import { Keymap } from '../../config-serializer/config-items/Keymap';
import { Macro } from '../../config-serializer/config-items/Macro';
import { UserConfiguration } from '../../config-serializer/config-items/UserConfiguration';
import { Layer } from '../../config-serializer/config-items/Layer';
import { Module } from '../../config-serializer/config-items/Module';
import { KeymapActions, MacroActions } from '../actions';
import { AppState } from '../index';

const initialState: UserConfiguration = new UserConfiguration();

/* tslint:disable:no-switch-case-fall-through */
// tslint bug: https://github.com/palantir/tslint/issues/1538

export default function (state = initialState, action: Action): UserConfiguration {
    const changedUserConfiguration: UserConfiguration = Object.assign(new UserConfiguration(), state);

    switch (action.type) {
        case KeymapActions.ADD:
        case KeymapActions.DUPLICATE:
            {
                const newKeymap: Keymap = new Keymap(action.payload);
                newKeymap.abbreviation = generateAbbr(state.keymaps, newKeymap.abbreviation);
                newKeymap.name = generateName(state.keymaps, newKeymap.name);
                newKeymap.isDefault = (state.keymaps.length === 0);

                changedUserConfiguration.keymaps = state.keymaps.concat(newKeymap);
                break;
            }
        case KeymapActions.EDIT_NAME:
            {
                const name: string = generateName(state.keymaps, action.payload.name);

                changedUserConfiguration.keymaps = state.keymaps.map((keymap: Keymap) => {
                    if (keymap.abbreviation === action.payload.abbr) {
                        keymap = Object.assign(new Keymap(), keymap);
                        keymap.name = name;
                    }
                    return keymap;
                });
                break;
            }
        case KeymapActions.EDIT_ABBR:
            const abbr: string = generateAbbr(state.keymaps, action.payload.newAbbr);

            changedUserConfiguration.keymaps = state.keymaps.map((keymap: Keymap) => {
                if (keymap.abbreviation === action.payload.abbr) {
                    keymap = Object.assign(new Keymap(), keymap);
                    keymap.abbreviation = abbr;
                }

                return keymap;
            });
            break;
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

            let filtered: Keymap[] = state.keymaps.filter((keymap: Keymap) => {
                if (keymap.abbreviation === action.payload) {
                    isDefault = keymap.isDefault;
                    return false;
                }

                return true;
            });

            // If deleted one is default set default keymap to the first on the list of keymaps
            if (isDefault && filtered.length > 0) {
                filtered[0].isDefault = true;
            }

            // Check for the deleted keymap in other keymaps
            changedUserConfiguration.keymaps = filtered.map(keymap => {
                keymap = Object.assign(new Keymap(), keymap);
                keymap.layers = checkExistence(keymap.layers, 'keymapAbbreviation', action.payload);

                return keymap;
            });
            break;

        case KeymapActions.SAVE_KEY:
            {
                const newKeymap: Keymap = Object.assign(new Keymap(), action.payload.keymap);
                newKeymap.layers = newKeymap.layers.slice();

                const layerIndex: number = action.payload.layer;
                const newLayer: Layer = Object.assign(new Layer(), newKeymap.layers[layerIndex]);
                newKeymap.layers[layerIndex] = newLayer;

                const moduleIndex: number = action.payload.module;
                const newModule: Module = Object.assign(new Module(), newLayer.modules[moduleIndex]);
                newLayer.modules[moduleIndex] = newModule;

                const keyIndex: number = action.payload.key;
                newModule.keyActions[keyIndex] = KeyActionHelper.createKeyAction(action.payload.keyAction);

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
        case MacroActions.ADD:
            {
                const newMacro = new Macro();
                newMacro.id = generateMacroId(state.macros);
                newMacro.name = generateName(state.macros, 'New macro');
                newMacro.isLooped = false;
                newMacro.isPrivate = true;
                newMacro.macroActions = [];

                changedUserConfiguration.macros = state.macros.concat(newMacro);
                break;
            }
        case MacroActions.DUPLICATE:
            {
                const newMacro = new Macro(action.payload);
                newMacro.name = generateName(state.macros, newMacro.name);
                newMacro.id = generateMacroId(state.macros);

                changedUserConfiguration.macros = state.macros.concat(newMacro);
                break;
            }
        case MacroActions.EDIT_NAME:
            {
                const name: string = generateName(state.macros, action.payload.name);

                changedUserConfiguration.macros = state.macros.map((macro: Macro) => {
                    if (macro.id === action.payload.id) {
                        macro.name = name;
                    }

                    return macro;
                });

                break;
            }
        case MacroActions.REMOVE:
            changedUserConfiguration.macros = state.macros.filter((macro: Macro) => macro.id !== action.payload);
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
        default:
            break;
    }

    return changedUserConfiguration;
}

export function getUserConfiguration(): (state$: Observable<AppState>) => Observable<UserConfiguration> {
    return (state$: Observable<AppState>) => state$
        .select(state => state.userConfiguration);
}

export function getKeymaps(): (state$: Observable<AppState>) => Observable<Keymap[]> {
    return (state$: Observable<AppState>) => state$
        .select(state => state.userConfiguration.keymaps);
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
        .select(state => state.userConfiguration.macros);
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
    }

    return abbr;
}

function generateName(items: { name: string }[], name: string) {
    let suffix = 2;
    const oldName: string = name;

    while (items.some(item => item.name === name)) {
        name = oldName + ` (${suffix})`;
        ++suffix;
    }

    return name;
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

function checkExistence(layers: Layer[], property: string, value: any) {
    let newLayers = layers.map((layer) => {
        let newLayer = new Layer(layer);

        newLayer.modules = layer.modules.map((module: Module) => {
            module.keyActions.forEach((action: KeyAction, index: number) => {
                if (action && action.hasOwnProperty(property) && action[property] === value) {
                    module.keyActions[index] = undefined;
                }
            });

            return module;
        });

        return newLayer;
    });

    return newLayers;
}
