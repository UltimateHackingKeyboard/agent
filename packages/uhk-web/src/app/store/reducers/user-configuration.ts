import {
    BacklightingMode,
    ConnectionsAction,
    Constants,
    emptyHostConnection,
    getDefaultHalvesInfo,
    HalvesInfo,
    HOST_CONNECTION_COUNT_MAX,
    HostConnection,
    HostConnections,
    initBacklightingColorPalette,
    KeyAction,
    KeyActionHelper,
    Keymap,
    KeystrokeAction,
    Layer,
    LayerName,
    LeftSlotModules,
    Macro,
    MacroActionHelper,
    MODIFIER_LAYER_NAMES,
    Module,
    ModuleConfiguration,
    MODULES_NONE_CONFIGS,
    NoneAction,
    PlayMacroAction,
    RgbColor,
    RgbColorInterface,
    RightSlotModules,
    SwitchKeymapAction,
    SwitchLayerAction,
    UserConfiguration
} from 'uhk-common';
import {
    BleAddingStates,
    BleAddingState,
    BacklightingOption,
    defaultLastEditKey,
    ExchangeKey,
    LastEditedKey,
    LayerOption,
    NewerUserConfiguration,
    OpenPopoverModel,
    SelectedMacroAction
} from '../../models';
import { getDefaultMacMouseSpeeds, getDefaultPcMouseSpeeds } from '../../services/default-mouse-speeds';
import {
    findModuleById,
    isValidName,
    setSvgKeyboardCoverColorsOfAllLayer,
    setSvgKeyboardCoverColorsOfLayer,
} from '../../util';
import * as AppActions from '../actions/app';
import * as DeviceActions from '../actions/device';
import * as Device from '../actions/device';
import * as DonglePairing from '../actions/dongle-pairing.action';
import * as KeymapActions from '../actions/keymap';
import * as MacroActions from '../actions/macro';
import * as UserConfig from '../actions/user-config';
import { addMissingModuleConfigs } from './add-missing-module-configs';
import { calculateLayerOptionsOfKeymap } from './calculate-layer-options-of-keymap';
import { getBaseLayerOption, initLayerOptions } from './layer-options';

export interface State {
    backlightingColorPalette: Array<RgbColorInterface>;
    selectedBacklightingColorIndex: number;
    isSelectedMacroNew: boolean;
    openedPopover?: OpenPopoverModel;
    userConfiguration: UserConfiguration;
    selectedKeymapAbbr?: string;
    selectedMacroId?: number;
    selectedMacroAction?: SelectedMacroAction;
    selectedModuleConfigurationId?: number;
    lastEditedKey: LastEditedKey;
    layerOptions: Map<number, LayerOption>;
    halvesInfo: HalvesInfo;
    newPairedDevices: string[];
    newPairedDevicesAdding: boolean;
    newerUserConfiguration?: NewerUserConfiguration;
    selectedLayerOption: LayerOption;
    theme: string;
}

export const initialState: State = {
    backlightingColorPalette: initBacklightingColorPalette(),
    selectedBacklightingColorIndex: -1,
    isSelectedMacroNew: false,
    userConfiguration: new UserConfiguration(),
    lastEditedKey: defaultLastEditKey(),
    layerOptions: initLayerOptions(),
    halvesInfo: getDefaultHalvesInfo(),
    newPairedDevices: [],
    newPairedDevicesAdding: false,
    selectedLayerOption: getBaseLayerOption(),
    theme: ''
};

export function reducer(
    state = initialState,
    action: AppActions.Actions | KeymapActions.Actions | MacroActions.Actions | UserConfig.Actions | DeviceActions.Actions | DonglePairing.Actions
): State {
    switch (action.type) {

        case AppActions.ActionTypes.SetAppTheme: {
            const theme = (action as AppActions.SetAppThemeAction).payload;
            const userConfiguration = state.userConfiguration.clone();
            setSvgKeyboardCoverColorsOfAllLayer(userConfiguration, theme);

            const newState = {
                ...state,
                userConfiguration,
                theme
            };

            return newState;
        }

        case AppActions.ActionTypes.LoadApplicationSettingsSuccess: {
            const applicationSettings = (action as AppActions.LoadApplicationSettingsSuccessAction).payload;

            return {
                ...state,
                backlightingColorPalette: applicationSettings.backlightingColorPalette
            };
        }

        case UserConfig.ActionTypes.AddNewPairedDevicesToHostConnections: {
            const userConfiguration: UserConfiguration = Object.assign(new UserConfiguration(), state.userConfiguration);
            userConfiguration.hostConnections = state.userConfiguration.hostConnections.filter(hostConnection => hostConnection.type !== HostConnections.Empty);
            for (const bleAddress of state.newPairedDevices) {
                const hostConnection = new HostConnection();
                hostConnection.type = HostConnections.BLE;
                hostConnection.address = bleAddress;
                hostConnection.name = generateHostConnectionName(userConfiguration.hostConnections, 'Bluetooth device');

                userConfiguration.hostConnections.push(hostConnection);
            }

            for (let i = userConfiguration.hostConnections.length; i < HOST_CONNECTION_COUNT_MAX; i++) {
                userConfiguration.hostConnections.push(emptyHostConnection());
            }

            return {
                ...state,
                userConfiguration,
                newPairedDevicesAdding: true,
            };
        }

        case UserConfig.ActionTypes.PreviewUserConfiguration:
        case UserConfig.ActionTypes.LoadResetUserConfiguration:
        case UserConfig.ActionTypes.LoadUserConfigSuccess: {
            const userConfig = (action as UserConfig.LoadUserConfigSuccessAction).payload;
            const newState = assignUserConfiguration(state, userConfig);
            newState.newerUserConfiguration = undefined;
            newState.selectedKeymapAbbr = undefined;
            newState.layerOptions = calculateLayerOptions(newState);

            return newState;
        }

        case UserConfig.ActionTypes.ApplyUserConfigurationFromFile: {
            const userConfig = (action as UserConfig.ApplyUserConfigurationFromFileAction).payload.userConfig;

            return assignUserConfiguration(state, userConfig);
        }

        case UserConfig.ActionTypes.AddColorToBacklightingColorPalette: {
            const color = (action as UserConfig.AddColorToBacklightingColorPaletteAction).payload;

            return {
                ...state,
                backlightingColorPalette: [...state.backlightingColorPalette, color],
            };
        }

        case UserConfig.ActionTypes.DeleteColorFromBacklightingColorPalette: {
            if (state.selectedBacklightingColorIndex === -1) {
                return state;
            }
            const backlightingColorPalette = [...state.backlightingColorPalette];
            backlightingColorPalette.splice(state.selectedBacklightingColorIndex, 1);

            return {
                ...state,
                backlightingColorPalette,
                selectedBacklightingColorIndex: -1,
            };
        }

        case UserConfig.ActionTypes.ModifyColorOfBacklightingColorPalette: {
            const payload = (action as UserConfig.ModifyColorOfBacklightingColorPaletteAction).payload;
            const newState = {
                ...state,
                backlightingColorPalette: [...state.backlightingColorPalette]
            };

            newState.backlightingColorPalette[payload.index] = payload.color;

            return newState;
        }

        case UserConfig.ActionTypes.UserConfigurationNewer: {
            return {
                ...state,
                newerUserConfiguration: (action as UserConfig.UserConfigurationNewerAction).payload,
            }
        }

        case UserConfig.ActionTypes.ToggleColorFromBacklightingColorPalette: {
            const index = (action as UserConfig.ToggleColorFromBacklightingColorPaletteAction).payload;

            return {
                ...state,
                selectedBacklightingColorIndex: index === state.selectedBacklightingColorIndex ? -1 : index,
            };
        }

        case UserConfig.ActionTypes.RecoverLEDSpaces: {
            const userConfiguration = Object.assign(new UserConfiguration(), state.userConfiguration);
            userConfiguration.perKeyRgbPresent = false;

            return {
                ...state,
                userConfiguration,
            };
        }

        case Device.ActionTypes.ConnectionStateChanged: {
            const payload = (action as Device.ConnectionStateChangedAction).payload;

            const newState: State = {
                ...state,
                halvesInfo: payload.halvesInfo,
                newPairedDevices: payload.newPairedDevices,
            };

            return assignUserConfiguration(newState, state.userConfiguration);
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

        case DeviceActions.ActionTypes.SaveToKeyboardFailed:
        case DeviceActions.ActionTypes.SaveToKeyboardSuccess: {
            return {
                ...state,
                newPairedDevicesAdding: false,
                newPairedDevices: [],
            };
        }

        case KeymapActions.ActionTypes.Add:
        case KeymapActions.ActionTypes.Duplicate: {
            const newKeymap: Keymap = new Keymap((action as KeymapActions.AddKeymapAction).payload);
            let duplicateKeymap = false;

            if (action.type === KeymapActions.ActionTypes.Add) {
                const keymapSet = new Set<string>(state.userConfiguration.keymaps.map(x => x.abbreviation));
                duplicateKeymap = keymapSet.has(newKeymap.abbreviation);

                for (const layer of newKeymap.layers) {
                    for (const module of layer.modules) {
                        module.keyActions = module.keyActions.map(keyAction => {
                            if (keyAction instanceof SwitchKeymapAction && !keymapSet.has(keyAction.keymapAbbreviation)) {
                                return new NoneAction();
                            }

                            return keyAction;
                        });
                    }
                }
            }

            if (duplicateKeymap || action.type === KeymapActions.ActionTypes.Duplicate) {
                newKeymap.abbreviation = generateAbbr(state.userConfiguration.keymaps, newKeymap.abbreviation);
                newKeymap.name = generateName(state.userConfiguration.keymaps, newKeymap.name);
            }
            newKeymap.isDefault = (state.userConfiguration.keymaps.length === 0);

            const userConfiguration: UserConfiguration = Object.assign(new UserConfiguration(), state.userConfiguration);
            userConfiguration.keymaps = insertItemInNameOrder(state.userConfiguration.keymaps, newKeymap);

            return {
                ...state,
                userConfiguration
            };
        }

        case KeymapActions.ActionTypes.AddLayer: {
            const newLayerId = (action as KeymapActions.AddLayerAction).payload;
            const currentKeymap = state.userConfiguration.keymaps.find(keymap => state.selectedKeymapAbbr);
            const baseLayer = currentKeymap.layers.find(layer => layer.id === LayerName.base);
            const newLayer = new Layer();
            newLayer.id = newLayerId;
            const leftModule = new Module();
            leftModule.id = 1;
            leftModule.keyActions = new Array(baseLayer.modules.find(findModuleById(1)).keyActions.length).fill(0).map(x => new NoneAction());
            const rightModule = new Module();
            rightModule.id = 0;
            rightModule.keyActions = new Array(baseLayer.modules.find(findModuleById(0)).keyActions.length).fill(0).map(x => new NoneAction());
            newLayer.modules = [
                rightModule,
                leftModule
            ];

            if (state.halvesInfo.leftModuleSlot !== LeftSlotModules.NoModule) {
                newLayer.modules.push(new Module(MODULES_NONE_CONFIGS[state.halvesInfo.leftModuleSlot]));
            }

            if (state.halvesInfo.rightModuleSlot !== RightSlotModules.NoModule) {
                newLayer.modules.push(new Module(MODULES_NONE_CONFIGS[state.halvesInfo.rightModuleSlot]));
            }

            const userConfiguration: UserConfiguration = Object.assign(new UserConfiguration(), state.userConfiguration);
            setSvgKeyboardCoverColorsOfLayer(userConfiguration.backlightingMode, newLayer, state.theme);

            userConfiguration.keymaps = userConfiguration.keymaps.map(keymap => {
                if (keymap.abbreviation === state.selectedKeymapAbbr) {
                    keymap = new Keymap(keymap);
                    keymap.layers.push(newLayer);
                }

                return keymap;
            });

            const newState = {
                ...state,
                userConfiguration
            };
            newState.layerOptions = calculateLayerOptions(newState);

            return newState;
        }

        case KeymapActions.ActionTypes.EditName: {
            const payload = (action as KeymapActions.EditKeymapNameAction).payload;

            if (!isValidName(payload.name)) {
                return reassignUserConfig(state);
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
                return reassignUserConfig(state);
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

        case KeymapActions.ActionTypes.SetKeyColor: {
            const payload = (action as KeymapActions.SetKeyColorAction).payload;
            const userConfiguration: UserConfiguration = Object.assign(new UserConfiguration(), state.userConfiguration);
            userConfiguration.keymaps = userConfiguration.keymaps.map(keymap => {
                if (keymap.abbreviation !== payload.keymap.abbreviation) {
                    return keymap;
                }

                keymap = Object.assign(new Keymap(), keymap);
                keymap.layers = keymap.layers.map(layer => {
                    if (layer.id !== payload.layer) {
                        return layer;
                    }

                    layer = new Layer(layer);
                    layer.modules = layer.modules.map(module => {
                        if(module.id !== payload.module) {
                            return module;
                        }

                        module = new Module(module);
                        const selectedColor = state.backlightingColorPalette[state.selectedBacklightingColorIndex];
                        let keyAction = KeyActionHelper.fromKeyAction(module.keyActions[payload.key]);
                        if (!keyAction) {
                            keyAction = new NoneAction();
                        }

                        keyAction.b = selectedColor.b;
                        keyAction.g = selectedColor.g;
                        keyAction.r = selectedColor.r;
                        module.keyActions[payload.key] = keyAction;

                        return module;
                    });

                    return layer;
                });

                return keymap;
            });

            return {
                ...state,
                userConfiguration,
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

        case KeymapActions.ActionTypes.RemoveLayer: {
            const deleteLayerId = (action as KeymapActions.AddLayerAction).payload;
            const secondaryRole = state.layerOptions.get(deleteLayerId).secondaryRole;

            const userConfiguration: UserConfiguration = Object.assign(new UserConfiguration(), state.userConfiguration);

            userConfiguration.keymaps = userConfiguration.keymaps.map(keymap => {
                if (keymap.abbreviation === state.selectedKeymapAbbr) {
                    keymap = new Keymap(keymap);
                    keymap.layers = keymap.layers
                        .filter(layer => layer.id !== deleteLayerId)
                        .map(layer => {
                            layer.modules.forEach(module => {
                                module.keyActions = module.keyActions.map(keyAction => {
                                    if (keyAction instanceof SwitchLayerAction && keyAction.layer === deleteLayerId) {
                                        return new NoneAction();
                                    }

                                    if (keyAction instanceof KeystrokeAction && keyAction.secondaryRoleAction === secondaryRole) {
                                        const newKeyAction = new KeystrokeAction(keyAction);
                                        newKeyAction.secondaryRoleAction = undefined;

                                        return newKeyAction;
                                    }
                                    return keyAction;
                                });
                            });

                            return layer;
                        });
                }

                return keymap;
            });

            const newState: State = {
                ...state,
                userConfiguration
            };
            newState.layerOptions = calculateLayerOptions(newState);

            if (state.selectedLayerOption.id === deleteLayerId) {
                for (const layerOption of newState.layerOptions.values()) {
                    if (layerOption.selected) {
                        if (layerOption.order < state.selectedLayerOption.order) {
                            newState.selectedLayerOption = {...layerOption};
                        } else {
                            break;
                        }
                    }
                }
            }

            return newState;
        }

        case KeymapActions.ActionTypes.ExchangeKeys: {
            const payload = (action as KeymapActions.ExchangeKeysAction).payload;
            const keymap = state.userConfiguration.getKeymap(payload.aKey.keymapAbbr);
            const aKeyAction = getKeyActionByExchangeKey(state.userConfiguration, payload.aKey);
            const bKeyAction = getKeyActionByExchangeKey(state.userConfiguration, payload.bKey);
            let remapOnAllLayer = false;

            if (aKeyAction instanceof KeystrokeAction && bKeyAction instanceof KeystrokeAction) {
                remapOnAllLayer =
                    !aKeyAction.hasScancode() &&
                    aKeyAction.hasActiveModifier() &&
                    aKeyAction.hasOnlyOneActiveModifier() &&
                    !aKeyAction.hasSecondaryRoleAction() &&
                    !bKeyAction.hasScancode() &&
                    bKeyAction.hasActiveModifier() &&
                    bKeyAction.hasOnlyOneActiveModifier() &&
                    !bKeyAction.hasSecondaryRoleAction();
            }

            const aSaveKeyAction = new KeymapActions.SaveKeyAction({
                keymap,
                key: payload.bKey.keyId,
                keyAction: {
                    remapOnAllKeymap: payload.remapInfo.remapOnAllKeymap,
                    remapOnAllLayer: payload.remapInfo.remapOnAllLayer || remapOnAllLayer,
                    action: aKeyAction
                },
                layer: payload.bKey.layerId,
                module: payload.bKey.moduleId
            });
            const bSaveKeyAction = new KeymapActions.SaveKeyAction({
                keymap,
                key: payload.aKey.keyId,
                keyAction: {
                    remapOnAllKeymap: payload.remapInfo.remapOnAllKeymap,
                    remapOnAllLayer: payload.remapInfo.remapOnAllLayer || remapOnAllLayer,
                    action: bKeyAction
                },
                layer: payload.aKey.layerId,
                module: payload.aKey.moduleId
            });
            let userConfig = saveKeyAction(state.userConfiguration, aSaveKeyAction);
            userConfig = saveKeyAction(userConfig, bSaveKeyAction);

            return {
                ...state,
                userConfiguration: userConfig
            };
        }

        case KeymapActions.ActionTypes.SaveKey: {
            let processedAction = action as KeymapActions.SaveKeyAction;
            const payload = processedAction.payload;
            const keyIndex: number = payload.key;
            const moduleIndex: number = payload.module;

            let newState = state;

            if (payload.keyAction.assignNewMacro) {
                newState = addNewMacroToState(state);
                const newAction = new PlayMacroAction();
                newAction.macroId = newState.selectedMacroId;

                processedAction = {
                    ...processedAction,
                    payload: {
                        ...payload,
                        keyAction: {
                            ...payload.keyAction,
                            action: newAction
                        }
                    }
                };
            }

            return {
                ...newState,
                userConfiguration: saveKeyAction(newState.userConfiguration, processedAction),
                lastEditedKey: {
                    key: 'key-' + keyIndex,
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
            return addNewMacroToState(state);
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
                userConfiguration,
                selectedMacroId: newMacro.id
            };
        }

        case MacroActions.ActionTypes.EditName: {
            const payload = (action as MacroActions.EditMacroNameAction).payload;
            if (!isValidName(payload.name)) {
                return reassignUserConfig(state);
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
                return reassignUserConfig(state);
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
            const newState = {
                ...state,
                selectedMacroId: undefined
            };
            const macroId = (action as MacroActions.RemoveMacroAction).payload;
            const userConfiguration = state.userConfiguration.clone();
            newState.userConfiguration = userConfiguration;
            userConfiguration.macros = [];
            const lastMacroIdx = state.userConfiguration.macros.length - 1;
            state.userConfiguration.macros.forEach((macro, idx) => {
                if (macroId === macro.id) {
                    if (idx === lastMacroIdx) {
                        if (state.userConfiguration.macros.length > 1) {
                            newState.selectedMacroId = state.userConfiguration.macros[idx - 1].id;
                        }
                    } else {
                        newState.selectedMacroId = state.userConfiguration.macros[idx + 1].id;
                    }
                } else {
                    userConfiguration.macros.push(macro);
                }
            });

            userConfiguration.keymaps.forEach(keymap => {
                keymap.layers.forEach(layer => {
                    layer.modules.forEach(module => {
                        module.keyActions = module.keyActions.map(keyAction => {
                            if (keyAction instanceof PlayMacroAction && keyAction.macroId === macroId) {
                                return new NoneAction();
                            }

                            return keyAction;
                        });
                    });
                });
            });

            return newState;
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

        case MacroActions.ActionTypes.DuplicateAction: {
            const payload = (action as MacroActions.DuplicateMacroActionAction).payload;
            const userConfiguration: UserConfiguration = Object.assign(new UserConfiguration(), state.userConfiguration);

            userConfiguration.macros = state.userConfiguration.macros.map((macro: Macro) => {
                if (macro.id === payload.macroId) {
                    macro = new Macro(macro);
                    const cloned = MacroActionHelper.fromMacroAction(macro.macroActions[payload.actionId]);

                    macro.macroActions = [
                        ...macro.macroActions.slice(0, payload.actionId),
                        cloned,
                        ...macro.macroActions.slice(payload.actionId)
                    ];
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
                    macro.macroActions = payload.macroActions;
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

        case UserConfig.ActionTypes.RenameHostConnection: {
            const payload = (action as UserConfig.RenameHostConnectionAction).payload;
            const userConfiguration: UserConfiguration = Object.assign(new UserConfiguration(), state.userConfiguration);
            const isDuplicated = state.userConfiguration.hostConnections.some((hostConnection, index) => {
                return index !== payload.index && hostConnection.name === payload.newName;
            });

            userConfiguration.hostConnections = userConfiguration.hostConnections.map((hostConnection, index) => {
                if (index === payload.index) {
                    const connection = new HostConnection(hostConnection);
                    connection.name = isDuplicated ? connection.name : payload.newName;

                    return connection;
                }

                return hostConnection;
            });

            return {
                ...state,
                userConfiguration,
            };
        }

        case UserConfig.ActionTypes.ReorderHostConnections: {
            const payload = (action as UserConfig.ReorderHostConnectionsAction).payload;
            const userConfiguration: UserConfiguration = Object.assign(new UserConfiguration(), state.userConfiguration);
            const processedConnectionActions = new WeakSet<ConnectionsAction>()
            userConfiguration.hostConnections = payload.map((reorderedConnection, index) => {
                if (reorderedConnection.index === index) {
                    return reorderedConnection;
                }

                userConfiguration.keymaps = userConfiguration.keymaps.map(keymap => {
                    keymap = Object.assign(new Keymap(), keymap)
                    keymap.layers = keymap.layers.map(layer => {
                        layer = Object.assign(new Layer(), layer);
                        layer.modules = layer.modules.map(module => {
                            module = Object.assign(new Module(), module);
                            module.keyActions = module.keyActions.map(keyAction => {
                                if (keyAction instanceof ConnectionsAction
                                    && keyAction.hostConnectionId === reorderedConnection.index
                                    && !processedConnectionActions.has(keyAction)) {
                                    const newKeyAction = new ConnectionsAction(keyAction);
                                    newKeyAction.hostConnectionId = index;
                                    processedConnectionActions.add(newKeyAction);

                                    return newKeyAction;
                                }

                                return keyAction;
                            })

                            return module;
                        })

                        return layer;
                    })

                    return keymap;
                })

                const newConnection = new HostConnection(reorderedConnection);
                newConnection.index = index;

                return newConnection;
            })

            return {
                ...state,
                userConfiguration,
            };
        }

        case UserConfig.ActionTypes.SelectModuleConfiguration: {
            return {
                ...state,
                selectedModuleConfigurationId: (action as UserConfig.SelectModuleConfigurationAction).payload
            };
        }

        case UserConfig.ActionTypes.SetHostConnectionSwitchover: {
            const payload = (action as UserConfig.SetHostConnectionSwitchoverAction).payload;
            const userConfiguration: UserConfiguration = Object.assign(new UserConfiguration(), state.userConfiguration);
            userConfiguration.hostConnections = [...userConfiguration.hostConnections];
            const newHostConnection = new HostConnection(userConfiguration.hostConnections[payload.index]);
            newHostConnection.switchover = payload.checked;
            userConfiguration.hostConnections[payload.index] = newHostConnection;

            return {
                ...state,
                userConfiguration,
            };
        }

        case UserConfig.ActionTypes.SetModuleConfigurationValue: {
            const payload = (action as UserConfig.SetModuleConfigurationValueAction).payload;
            const userConfiguration: UserConfiguration = Object.assign(new UserConfiguration(), state.userConfiguration);

            userConfiguration.moduleConfigurations = userConfiguration.moduleConfigurations.map(moduleConfiguration => {
                if(moduleConfiguration.id === payload.moduleId) {
                    moduleConfiguration = new ModuleConfiguration(moduleConfiguration);
                    moduleConfiguration[payload.propertyName] = payload.value;

                    return moduleConfiguration;
                }

                return moduleConfiguration;
            });

            return {
                ...state,
                userConfiguration
            };
        }
        case UserConfig.ActionTypes.SetUserConfigurationRgbValue: {
            const payload = (action as UserConfig.SetUserConfigurationRgbValueAction).payload;
            const userConfiguration: UserConfiguration = Object.assign(new UserConfiguration(), state.userConfiguration);
            userConfiguration[payload.propertyName] = new RgbColor(payload.value);

            return {
                ...state,
                userConfiguration
            };
        }

        case UserConfig.ActionTypes.SetUserConfigurationValue: {
            const payload = (action as UserConfig.SetUserConfigurationValueAction).payload;
            const userConfiguration: UserConfiguration = Object.assign(new UserConfiguration(), state.userConfiguration);
            userConfiguration[payload.propertyName] = payload.value;
            let selectedBacklightingColorIndex = state.selectedBacklightingColorIndex;

            if (payload.propertyName === 'backlightingMode') {
                selectedBacklightingColorIndex = -1;
                if (payload.value === BacklightingMode.PerKeyBacklighting) {
                    userConfiguration.perKeyRgbPresent = true;
                }
                setSvgKeyboardCoverColorsOfAllLayer(userConfiguration, state.theme);
            }

            return {
                ...state,
                selectedBacklightingColorIndex,
                userConfiguration
            };
        }

        case KeymapActions.ActionTypes.EditDescription: {
            const data = (action as KeymapActions.EditDescriptionAction).payload;

            const userConfiguration: UserConfiguration = Object.assign(new UserConfiguration(), state.userConfiguration);
            userConfiguration.keymaps = state.userConfiguration.keymaps.map(keymap => {
                if (keymap.abbreviation === data.abbr) {
                    const newKeymap = new Keymap(keymap);
                    newKeymap.description = data.description;

                    return newKeymap;
                }

                return keymap;
            });

            return {
                ...state,
                userConfiguration
            };
        }

        case KeymapActions.ActionTypes.Select: {
            const newState = {
                ...state,
                selectedKeymapAbbr: (action as KeymapActions.SelectKeymapAction).payload,
                lastEditedKey: defaultLastEditKey(),
                openedPopover: undefined,
            };
            newState.layerOptions = calculateLayerOptions(newState);
            const currentLayerOption = newState.layerOptions.get(newState.selectedLayerOption.id);

            if (!currentLayerOption.selected) {
                newState.selectedLayerOption = getBaseLayerOption();
            }

            return newState;
        }

        case KeymapActions.ActionTypes.SelectLayer: {
            let selectedLayer = (action as KeymapActions.SelectLayerAction).payload;

            if (selectedLayer === state.selectedLayerOption.id) {
                return state;
            }

            const currentLayerOption = state.layerOptions.get(selectedLayer);

            if (!currentLayerOption.selected) {
                selectedLayer = LayerName.base;
            }

            return {
                ...state,
                selectedLayerOption: state.layerOptions.get(selectedLayer),
                openedPopover: undefined,
            };
        }

        case KeymapActions.ActionTypes.OpenPopover:
            return {
                ...state,
                openedPopover: (action as KeymapActions.OpenPopoverAction).payload
            };

        case MacroActions.ActionTypes.Select: {
            const selectedMacroId = (action as MacroActions.SelectMacroAction).payload;

            if (selectedMacroId === state.selectedMacroId) {
                return state;
            }

            return {
                ...state,
                selectedMacroId,
                isSelectedMacroNew: false,
                selectedMacroAction: undefined
            };
        }

        case MacroActions.ActionTypes.SelectAction: {
            return {
                ...state,
                selectedMacroAction: (action as MacroActions.SelectMacroActionAction).payload
            };
        }

        case DonglePairing.ActionTypes.DeleteHostConnectionSuccess: {
            const {index} = (action as DonglePairing.DeleteHostConnectionSuccessAction).payload;
            const userConfiguration: UserConfiguration = Object.assign(new UserConfiguration(), state.userConfiguration);
            userConfiguration.hostConnections = [...state.userConfiguration.hostConnections];
            userConfiguration.hostConnections.splice(index, 1);
            userConfiguration.hostConnections.push(emptyHostConnection());

            return  {
                ...state,
                userConfiguration,
            };
        }

        case DonglePairing.ActionTypes.DonglePairingSuccess: {
            const bleAddress = (action as DonglePairing.DonglePairingSuccessAction).payload;

            const isUserConfigContainsBleAddress = state.userConfiguration.hostConnections.some(hostConnection => {
                return hostConnection.type === HostConnections.Dongle && hostConnection.address === bleAddress;
            });

            if (isUserConfigContainsBleAddress) {
                return state;
            }

            const userConfiguration: UserConfiguration = Object.assign(new UserConfiguration(), state.userConfiguration);
            userConfiguration.hostConnections = [...userConfiguration.hostConnections];

            for (let i = 0; i < userConfiguration.hostConnections.length; i += 1) {
                const hostConnection = userConfiguration.hostConnections[i];
                if (hostConnection.type === HostConnections.Empty || i === userConfiguration.hostConnections.length - 1) {
                    const newHostConnection = new HostConnection();
                    newHostConnection.type = HostConnections.Dongle;
                    newHostConnection.address = bleAddress;
                    newHostConnection.name = generateHostConnectionName(userConfiguration.hostConnections, 'Dongle');

                    userConfiguration.hostConnections[i] = newHostConnection;
                    break;
                }
            }

            return {
                ...state,
                userConfiguration,
            };
        }

        default:
            return state;
    }
}

export const getNewPairedDevicesState = (state: State): BleAddingState => {
    let addingState = BleAddingStates.Idle;
    if (state.newPairedDevicesAdding) {
        addingState = BleAddingStates.Adding;
    }
    else if (state.userConfiguration.hostConnections.length > HOST_CONNECTION_COUNT_MAX) {
        addingState = BleAddingStates.TooMuchHostConnections;
    }

    return {
        state: addingState,
        nrOfNewBleAddresses: state.newPairedDevices.length,
        nrOfHostConnections: state.userConfiguration.hostConnections.length,
        showNewPairedDevicesPanel: state.newPairedDevices.length > 0 || state.userConfiguration.hostConnections.length > HOST_CONNECTION_COUNT_MAX || state.newPairedDevicesAdding
    };
};
export const getUserConfiguration = (state: State): UserConfiguration => state.userConfiguration;
export const getKeymaps = (state: State): Keymap[] => state.userConfiguration.keymaps;
export const getDefaultKeymap = (state: State): Keymap => state.userConfiguration.keymaps.find(keymap => keymap.isDefault);
export const getHostConnections = (state: State): HostConnection[] => {
    return state.userConfiguration.hostConnections;
};
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
export const isSelectedMacroNew = (state: State): boolean => state.isSelectedMacroNew;
export const isKeymapDeletable = (state: State): boolean => state.userConfiguration.keymaps.length > 1;
export const hasMacro = (state: State): boolean => state.userConfiguration.macros.length > 0;
export const reduceMacroToMap = (map: Map<number, Macro>, macro: Macro) => map.set(macro.id, macro);
export const getMacroMap = (state: State): Map<number, Macro> => {
    return state.userConfiguration.macros.reduce(reduceMacroToMap, new Map());
};
export const lastEditedKey = (state: State): LastEditedKey => state.lastEditedKey;
export const getOpenPopover = (state: State): OpenPopoverModel => state.openedPopover;
export const getLayerOptions = (state: State): LayerOption[] => Array
    .from(state.layerOptions.values())
    .sort((a, b) => a.order - b.order);
export const getSelectedLayerOption = (state: State): LayerOption => state.selectedLayerOption;
export const getSelectedMacroAction = (state: State): SelectedMacroAction => state.selectedMacroAction;
export const getSelectedModuleConfiguration = (state: State): ModuleConfiguration => {
    if(!state.selectedModuleConfigurationId) {
        return new ModuleConfiguration();
    }

    const moduleConfiguration = state.userConfiguration.moduleConfigurations
        .find(moduleConfiguration => moduleConfiguration.id === state.selectedModuleConfigurationId);

    return moduleConfiguration || new ModuleConfiguration();
};
export const showColorPalette = (state: State): boolean => state.userConfiguration?.backlightingMode === BacklightingMode.PerKeyBacklighting;
export const perKeyRgbPresent = (state: State): boolean => state.userConfiguration.perKeyRgbPresent;
export const backlightingMode = (state: State): BacklightingMode => state.userConfiguration.backlightingMode;
export const backlightingOptions = (state: State): Array<BacklightingOption> => {
    return [
        {
            displayText: 'Functional backlighting',
            mode: BacklightingMode.FunctionalBacklighting
        },
        {
            displayText: 'Per-key backlighting',
            mode: BacklightingMode.PerKeyBacklighting
        }
    ];
};
export const getNewerUserConfiguration = (state: State): NewerUserConfiguration => state.newerUserConfiguration;
export const hasRecoverableLEDSpace = (state: State): boolean => state.userConfiguration.backlightingMode === BacklightingMode.FunctionalBacklighting && state.userConfiguration.perKeyRgbPresent;
export const backlightingColorPalette = (state: State): Array<RgbColorInterface> => state.backlightingColorPalette;
export const isBacklightingColoring = (state: State): boolean => state.selectedBacklightingColorIndex > -1;
export const selectedBacklightingColor = (state: State): RgbColorInterface => state.backlightingColorPalette[state.selectedBacklightingColorIndex];
export const selectedBacklightingColorIndex = (state: State): number => state.selectedBacklightingColorIndex;

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
    const regexp = / \((\d+)\)$/;
    const regexpResult = regexp.exec(name);
    let suffix = regexpResult
        ? parseInt(regexpResult[1]) + 1
        : 2;
    const matchName = name.replace(regexp, '');
    const nameSet = new Set<string>();
    items.forEach(item => nameSet.add(item.name));

    while (true) {
        const newName = `${matchName} (${suffix})`;
        if (nameSet.has(newName)) {
            suffix++;
        } else {
            return newName;
        }
    }
}

function generateMacroId(macros: Macro[]) {
    let newId = 0;
    let usedMacroIds = new Set();

    macros.forEach((macro: Macro) => {
        if (macro.id > newId) {
            newId = macro.id;
        }

        usedMacroIds.add(macro.id);
    });

    newId += 1;

    if (newId <= Constants.MAX_ALLOWED_MACROS)
        return newId;

    for (let i = 0; i <= Constants.MAX_ALLOWED_MACROS; i++) {
        if (!usedMacroIds.has(i)) {
            return i;
        }
    }
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
        newModules[path.moduleIdx].keyActions[path.keyActionIdx] = new NoneAction(newModules[path.moduleIdx].keyActions[path.keyActionIdx]);
    }

    return newLayers;
}

function setKeyActionToLayer(layer: Layer, moduleIndex: number, keyIndex: number, newKeyAction: KeyAction): Layer {
    const newLayer: Layer = Object.assign(new Layer, layer);
    const newModule: Module = Object.assign(new Module(), newLayer.modules.find(findModuleById(moduleIndex)));
    newLayer.modules = newLayer.modules.slice();
    const moduleIndexInArray = newLayer.modules.findIndex(findModuleById(moduleIndex));
    newLayer.modules[moduleIndexInArray] = newModule;

    newModule.keyActions = newModule.keyActions.slice();
    if (!newKeyAction) {
        newKeyAction = new NoneAction(newModule.keyActions[keyIndex]);
    }
    newModule.keyActions[keyIndex] = newKeyAction;

    return newLayer;
}

function assignUserConfiguration(state: State, userConfig: UserConfiguration, theme?: string): State {
    let userConfiguration = Object.assign(new UserConfiguration(), {
        ...state.userConfiguration,
        ...userConfig,
        keymaps: [...userConfig.keymaps].sort((first: Keymap, second: Keymap) => first.name.localeCompare(second.name)),
        macros: [...userConfig.macros].sort((first: Macro, second: Macro) => first.name.localeCompare(second.name))
    });

    if (state.halvesInfo.leftModuleSlot !== LeftSlotModules.NoModule) {
        userConfiguration = addMissingModuleConfigs(userConfiguration, state.halvesInfo.leftModuleSlot);
    }

    if (state.halvesInfo.rightModuleSlot !== RightSlotModules.NoModule) {
        userConfiguration = addMissingModuleConfigs(userConfiguration, state.halvesInfo.rightModuleSlot);
    }

    setSvgKeyboardCoverColorsOfAllLayer(userConfiguration, theme);

    return {
        ...state,
        userConfiguration
    };

}

function saveKeyAction(userConfig: UserConfiguration, action: KeymapActions.SaveKeyAction): UserConfiguration {
    const payload = action.payload;
    const keyIndex: number = payload.key;
    const layerIndex: number = payload.layer;
    const moduleIndex: number = payload.module;
    const keyActionRemap = payload.keyAction;
    const newKeyAction = keyActionRemap.action;
    const newKeymap: Keymap = payload.keymap;
    const isSwitchLayerAction = newKeyAction instanceof SwitchLayerAction;
    const isSwitchKeymapAction = newKeyAction instanceof SwitchKeymapAction;
    const oldKeyAction = newKeymap
        .layers.find(layer => layer.id === layerIndex)
        .modules.find(findModuleById(moduleIndex)).keyActions[keyIndex];
    const oldKeyIsSwitchLayerAction = oldKeyAction instanceof SwitchLayerAction;

    const userConfiguration: UserConfiguration = Object.assign(new UserConfiguration(), userConfig);
    userConfiguration.keymaps = userConfig.keymaps.map(keymap => {
        // SwitchKeymapAction not allow to refer to itself
        if (isSwitchKeymapAction && keymap.abbreviation === (newKeyAction as any).keymapAbbreviation) {
            return keymap;
        }

        if (keyActionRemap.remapOnAllKeymap || keymap.abbreviation === newKeymap.abbreviation) {
            keymap = Object.assign(new Keymap, keymap);
            keymap.layers = keymap.layers.map(layer => {
                if ((keyActionRemap.remapOnAllLayer && !MODIFIER_LAYER_NAMES.includes(layer.id)) || layer.id === layerIndex || isSwitchLayerAction) {
                    const clonedAction = KeyActionHelper.fromKeyAction(newKeyAction);
                    // If the key action is a SwitchLayerAction then set the same SwitchLayerAction
                    // on the target layer and remove SwitchLayerAction from other layers
                    if (isSwitchLayerAction) {
                        if (layer.id === LayerName.base || layer.id === (newKeyAction as SwitchLayerAction).layer) {
                            return setKeyActionToLayer(layer, moduleIndex, keyIndex, clonedAction);
                        } else {
                            const actionOnLayer = layer.modules.find(findModuleById(moduleIndex)).keyActions[keyIndex];
                            if (actionOnLayer && actionOnLayer instanceof SwitchLayerAction) {
                                return setKeyActionToLayer(layer, moduleIndex, keyIndex, null);
                            }
                        }
                    } else {
                        return setKeyActionToLayer(layer, moduleIndex, keyIndex, clonedAction);
                    }
                } else if (oldKeyIsSwitchLayerAction && layer.id === (oldKeyAction as SwitchLayerAction).layer) {
                    return setKeyActionToLayer(layer, moduleIndex, keyIndex, null);
                }

                return layer;
            });
        }

        return keymap;
    });

    return userConfiguration;
}

function getKeyActionByExchangeKey(userConfig: UserConfiguration, exchangeKey: ExchangeKey): KeyAction {
    return userConfig
        .getKeymap(exchangeKey.keymapAbbr)
        .layers.find(layer => layer.id === exchangeKey.layerId)
        .modules.find(findModuleById(exchangeKey.moduleId))
        .keyActions[exchangeKey.keyId];
}

function reassignUserConfig(state: State): State {
    const userConfiguration = Object.assign(new UserConfiguration(), state.userConfiguration);
    userConfiguration.keymaps = userConfiguration.keymaps.map(keymap => new Keymap(keymap));
    userConfiguration.macros = userConfiguration.macros.map(macro => new Macro(macro));

    return {
        ...state,
        userConfiguration
    };
}

function calculateLayerOptions(state: State): Map<number, LayerOption> {
    const selectedKeymap = getSelectedKeymap(state);

    return calculateLayerOptionsOfKeymap(selectedKeymap);
}

function addNewMacroToState(state: State): State {
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
        userConfiguration,
        selectedMacroId: newMacro.id,
        isSelectedMacroNew: true
    };
}

function generateHostConnectionName(hostConnections: HostConnection[], baseName: string): string {
    let iter: number = 1;
    let name = baseName;

    while (true) {
        if (iter !== 1) {
            name = `${baseName} ${iter}`;
        }

        const exists = hostConnections.find(host => host.name === name);

        if (!exists) {
            return name;
        }

        iter++;
    }
}
