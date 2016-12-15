import '@ngrx/core/add/operator/select';
import { Action } from '@ngrx/store';

import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

import { Helper as KeyActionHelper, KeyAction } from '../../config-serializer/config-items/key-action';
import { Keymap } from '../../config-serializer/config-items/Keymap';
import { Layer } from '../../config-serializer/config-items/Layer';
import { Module } from '../../config-serializer/config-items/Module';
import { KeymapActions } from '../actions';
import { AppState, KeymapState } from '../index';

const initialState: KeymapState = {
    entities: []
};

export default function (state = initialState, action: Action): KeymapState {
    let newState: Keymap[];
    let changedKeymap: Keymap = new Keymap();

    switch (action.type) {
        case KeymapActions.ADD:
        case KeymapActions.DUPLICATE:

            let newKeymap: Keymap = new Keymap(action.payload);

            newKeymap.abbreviation = generateAbbr(state.entities, newKeymap.abbreviation);
            newKeymap.name = generateName(state.entities, newKeymap.name);
            newKeymap.isDefault = (state.entities.length === 0);

            return {
                entities: [...state.entities, newKeymap]
            };

        case KeymapActions.EDIT_NAME:
            let name: string = generateName(state.entities, action.payload.name);

            newState = state.entities.map((keymap: Keymap) => {
                if (keymap.abbreviation === action.payload.abbr) {
                    keymap.name = name;
                }

                return keymap;
            });

            return {
                entities: newState
            };

        case KeymapActions.EDIT_ABBR:
            let abbr: string = generateAbbr(state.entities, action.payload.newAbbr);

            newState = state.entities.map((keymap: Keymap) => {
                if (keymap.abbreviation === action.payload.abbr) {
                    keymap.abbreviation = abbr;
                }

                return keymap;
            });

            return {
                entities: newState,
                newAbbr: abbr
            };

        case KeymapActions.SET_DEFAULT:
            newState = state.entities.map((keymap: Keymap) => {
                if (keymap.abbreviation === action.payload || keymap.isDefault) {
                    let newKeymap: Keymap = new Keymap();
                    Object.assign(newKeymap, keymap);
                    keymap = newKeymap;
                    keymap.isDefault = keymap.abbreviation === action.payload;
                }

                return keymap;
            });

            return {
                entities: newState
            };

        case KeymapActions.REMOVE:
            let isDefault: boolean;

            let filtered: Keymap[] = state.entities.filter((keymap: Keymap) => {
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

            const deletedKeymap = state.entities.find(keymap => keymap.abbreviation === action.payload);
            // Check for the deleted keymap in other keymaps
            newState = filtered.map((keymap: Keymap) => {
                changedKeymap = new Keymap();
                Object.assign(changedKeymap, keymap);
                changedKeymap.layers = checkExistence(changedKeymap.layers, 'keymap', deletedKeymap);

                return changedKeymap;
            });

            return {
                entities: newState
            };

        case KeymapActions.SAVE_KEY:

            const keymap: Keymap = action.payload.keymap;
            Object.assign(changedKeymap, keymap);

            const layerIndex: number = action.payload.layer;
            const layer: Layer = changedKeymap.layers[layerIndex];
            const changedLayer: Layer = new Layer();
            Object.assign(changedLayer, layer);
            changedKeymap.layers = changedKeymap.layers.slice();
            changedKeymap.layers[layerIndex] = changedLayer;

            const moduleIndex: number = action.payload.module;
            const module: Module = changedLayer.modules[moduleIndex];
            const changedModule: Module = new Module();
            Object.assign(changedModule, module);
            changedLayer.modules[moduleIndex] = changedModule;

            const keyIndex: number = action.payload.key;
            changedModule.keyActions[keyIndex] = KeyActionHelper.createKeyAction(action.payload.keyAction);

            newState = state.entities.map((keymap: Keymap) => {
                if (keymap.abbreviation === changedKeymap.abbreviation) {
                    keymap = changedKeymap;
                }

                return keymap;
            });

            return {
                entities: newState
            };

        case KeymapActions.CHECK_MACRO:
            newState = state.entities.map((keymap: Keymap) => {
                changedKeymap = new Keymap();
                Object.assign(changedKeymap, keymap);
                changedKeymap.layers = checkExistence(changedKeymap.layers, 'macro', action.payload);

                return changedKeymap;
            });

            return {
                entities: newState
            };

        default: {
            return state;
        }
    }
}

export function getKeymapEntities(): (state$: Observable<AppState>) => Observable<Keymap[]> {
    return (state$: Observable<AppState>) => state$
        .select(state => state.keymaps.entities);
}

export function getKeymap(abbr: string) {
    if (abbr === undefined) {
        return getDefault();
    }

    return (state$: Observable<AppState>) => state$
        .select(appState => appState.keymaps.entities)
        .map((keymaps: Keymap[]) =>
            keymaps.find((keymap: Keymap) => keymap.abbreviation === abbr)
        );
}

export function getDefault() {
    return (state$: Observable<AppState>) => state$
        .select(appState => appState.keymaps.entities)
        .map((keymaps: Keymap[]) =>
            keymaps.find((keymap: Keymap) => keymap.isDefault)
        );
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

function generateName(keymaps: Keymap[], name: string) {
    let suffix = 2;
    const oldName: string = name;

    while (keymaps.some((keymap: Keymap) => keymap.name === name)) {
        name = oldName + ` (${suffix})`;
        ++suffix;
    }

    return name;
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
