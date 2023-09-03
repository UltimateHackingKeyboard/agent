import { Action } from '@ngrx/store';
import {
    defaultFirmwareJson,
    FirmwareJson,
    FirmwareUpgradeFailReason,
    HardwareModules,
    isOfficialUhkFirmware,
    ModuleInfo,
    ModuleSlotToId,
    RIGHT_HALF_FIRMWARE_UPGRADE_MODULE_NAME,
    UHK_MODULES,
    UhkModule
} from 'uhk-common';

import * as Device from '../actions/device';
import { RecoveryDeviceReplyAction, UpdateFirmwareAction, UpdateFirmwareWithAction } from '../actions/device';
import * as App from '../actions/app';
import { FirmwareUpgradeState, ModuleFirmwareUpgradeState, ModuleFirmwareUpgradeStates } from '../../models';
import { XtermCssClass, XtermLog } from '../../models/xterm-log';

export enum FirmwareUpgradeStates {
    Idle = 'Idle',
    Started = 'Started',
    StartedWith = 'StartedWith',
    ModulesNotUpdated = 'ModulesNotUpdated',
    ForceUpdateStarted = 'ForceUpdateStarted',
    ForceUpdateStartedWith = 'ForceUpdateStartedWith',
    Success = 'Success',
    Failed = 'Failed',
    Recovering = 'Recovering'
}

const FIRMWARE_UPGRADING_STATES = [
    FirmwareUpgradeStates.Started,
    FirmwareUpgradeStates.StartedWith,
    FirmwareUpgradeStates.ForceUpdateStarted,
    FirmwareUpgradeStates.ForceUpdateStartedWith,
    FirmwareUpgradeStates.Recovering
];

const FIRMWARE_NOT_FORCE_UPGRADING = [
    FirmwareUpgradeStates.Started,
    FirmwareUpgradeStates.StartedWith
];

export interface State {
    bundledFirmwareJson: FirmwareJson;
    firmwareJson?: FirmwareJson;
    log: Array<XtermLog>;
    modules: Array<ModuleFirmwareUpgradeState>;
    recoveryModules: Array<UhkModule>;
    showForceFirmwareUpgrade: boolean;
    showForceFirmwareUpgradeWith: boolean;
    upgradeState: FirmwareUpgradeStates;
    upgradedModule: boolean;
    failReason?: FirmwareUpgradeFailReason
}

export const initialState: State = {
    bundledFirmwareJson: defaultFirmwareJson(),
    modules: [],
    recoveryModules: [],
    log: [{ message: '', cssClass: XtermCssClass.standard }],
    showForceFirmwareUpgrade: false,
    showForceFirmwareUpgradeWith: false,
    upgradeState: FirmwareUpgradeStates.Idle,
    upgradedModule: false
};

export function reducer(state = initialState, action: Action): State {
    switch (action.type) {

        case Device.ActionTypes.UpdateFirmwareJson: {
            const firmwareJson = (action as Device.UpdateFirmwareJsonAction).payload;
            const newState = {
                ...state,
                firmwareJson
            };

            newState.modules = newState.modules.map(module => {
                return {
                    ...module,
                    newFirmwareVersion: firmwareJson?.firmwareVersion,
                    state: firmwareJson?.firmwareVersion === module.currentFirmwareVersion
                    && FIRMWARE_NOT_FORCE_UPGRADING.includes(state.upgradeState)
                        ? ModuleFirmwareUpgradeStates.Success
                        : ModuleFirmwareUpgradeStates.Idle
                };
            });

            return newState;
        }

        case Device.ActionTypes.ConnectionStateChanged: {
            const hardwareModules = (action as Device.ConnectionStateChangedAction).payload.hardwareModules;

            return {
                ...state,
                modules: mapModules(state.bundledFirmwareJson, state.firmwareJson, hardwareModules),
                recoveryModules: calculateRecoveryModules(hardwareModules.moduleInfos)
            };
        }

        case Device.ActionTypes.CurrentlyUpdatingModule: {
            const currentlyUpdatingModule = (action as Device.CurrentlyUpdatingModuleAction).payload;

            return {
                ...state,
                modules: state.modules.map(module => {
                    if (module.moduleName === currentlyUpdatingModule) {
                        return {
                            ...module,
                            state: ModuleFirmwareUpgradeStates.Upgrading
                        };
                    } else if (module.state === ModuleFirmwareUpgradeStates.Upgrading) {
                        return {
                            ...module,
                            state: ModuleFirmwareUpgradeStates.Success,
                            newFirmwareVersion: state.firmwareJson?.firmwareVersion,
                            currentFirmwareVersion: state.firmwareJson?.firmwareVersion,
                            gitRepo: state.firmwareJson?.gitInfo?.repo,
                            gitTag: state.firmwareJson?.gitInfo?.tag,
                        };
                    }

                    return module;
                }),
                upgradedModule: true
            };
        }

        case Device.ActionTypes.UpdateFirmware:
            return {
                ...state,
                log: [{ message: 'Start flashing firmware', cssClass: XtermCssClass.standard }],
                upgradeState: (action as UpdateFirmwareAction).payload
                    ? FirmwareUpgradeStates.ForceUpdateStarted
                    : FirmwareUpgradeStates.Started,
                upgradedModule: false,
                showForceFirmwareUpgrade: false,
                showForceFirmwareUpgradeWith: false,
                failReason: undefined
            };

        case Device.ActionTypes.UpdateFirmwareWith:
            return {
                ...state,
                log: [{ message: 'Start flashing firmware', cssClass: XtermCssClass.standard }],
                upgradeState: (action as UpdateFirmwareWithAction).payload.forceUpgrade
                    ? FirmwareUpgradeStates.ForceUpdateStartedWith
                    : FirmwareUpgradeStates.StartedWith,
                upgradedModule: false,
                showForceFirmwareUpgrade: false,
                showForceFirmwareUpgradeWith: false,
                failReason: undefined
            };

        case Device.ActionTypes.UpdateFirmwareSuccess:
            return {
                ...state,
                firmwareJson: undefined,
                upgradeState: state.upgradedModule
                    ? FirmwareUpgradeStates.Success
                    : FirmwareUpgradeStates.ModulesNotUpdated,
                showForceFirmwareUpgrade: state.upgradedModule
                    ? false
                    : state.upgradeState === FirmwareUpgradeStates.Started,
                showForceFirmwareUpgradeWith: state.upgradedModule
                    ? false
                    : state.upgradeState === FirmwareUpgradeStates.StartedWith,
                modules: state.modules.map(module => {
                    if (module.state === ModuleFirmwareUpgradeStates.Upgrading) {
                        return {
                            ...module,
                            state: ModuleFirmwareUpgradeStates.Success,
                            newFirmwareVersion: state.firmwareJson?.firmwareVersion,
                            currentFirmwareVersion: state.firmwareJson?.firmwareVersion,
                            gitRepo: state.firmwareJson?.gitInfo?.repo,
                            gitTag: state.firmwareJson?.gitInfo?.tag
                        };
                    } else if (!state.upgradedModule && module.state === ModuleFirmwareUpgradeStates.Idle) {
                        return {
                            ...module,
                            state: ModuleFirmwareUpgradeStates.Success,
                            newFirmwareVersion: state.firmwareJson?.firmwareVersion,
                            currentFirmwareVersion: state.firmwareJson?.firmwareVersion
                        };
                    }

                    return module;
                })
            };

        case Device.ActionTypes.UpdateFirmwareFailed: {
            const data = (action as Device.UpdateFirmwareFailedAction).payload;
            const logEntry = {
                message: data.error.message,
                cssClass: XtermCssClass.error
            };

            return {
                ...state,
                log: [...state.log, logEntry],
                upgradeState: FirmwareUpgradeStates.Failed,
                modules: state.modules.map(module => {
                    if (module.state === ModuleFirmwareUpgradeStates.Upgrading) {
                        return {
                            ...module,
                            state: ModuleFirmwareUpgradeStates.Failed,
                            newFirmwareVersion: state.firmwareJson?.firmwareVersion,
                            currentFirmwareVersion: state.firmwareJson?.firmwareVersion
                        };
                    }

                    return module;
                })
            };
        }

        case Device.ActionTypes.UpdateFirmwareNotSupported: {
            return {
                ...state,
                failReason: (action as Device.UpdateFirmwareNotSupportedAction).payload,
                upgradeState: FirmwareUpgradeStates.Idle
            };
        }

        case App.ActionTypes.AppProcessStartInfo:
            return {
                ...state,
                bundledFirmwareJson: (action as App.ProcessAppStartInfoAction).payload.bundledFirmwareJson
            };

        case App.ActionTypes.ElectronMainLogReceived: {
            if (!FIRMWARE_UPGRADING_STATES.includes(state.upgradeState)) {
                return state;
            }

            const payload = (action as App.ElectronMainLogReceivedAction).payload;

            if (payload.message.indexOf('UHK Device not found:') > -1) {
                return state;
            }

            const newState = {
                ...state,
                log: [...state.log]
            };
            const lastLogEntry = state.log[state.log.length - 1];
            if (lastLogEntry.message.startsWith(payload.message)) {
                newState.log[newState.log.length - 1] = {
                    ...lastLogEntry,
                    message: lastLogEntry.message + '.'
                };
            } else {
                newState.log.push({
                    message: payload.message,
                    cssClass: payload.level === 'error' ? XtermCssClass.error : XtermCssClass.standard
                });
            }

            return newState;
        }

        case Device.ActionTypes.RecoveryModule:
        case Device.ActionTypes.RecoveryDevice: {
            return {
                ...state,
                upgradeState: FirmwareUpgradeStates.Recovering,
                log: [{ message: '', cssClass: XtermCssClass.standard }]
            };
        }

        case Device.ActionTypes.RecoveryModuleReply: {
            const response = (action as RecoveryDeviceReplyAction).payload;

            return {
                ...state,
                upgradeState: response.success ? FirmwareUpgradeStates.Success : FirmwareUpgradeStates.Failed,
                modules: mapModules(state.bundledFirmwareJson, state.firmwareJson, response.modules),
                recoveryModules: calculateRecoveryModules(response.modules.moduleInfos)
            };
        }

        default:
            return state;
    }
}

export const xtermLog = (state: State) => state.log;
export const updatingFirmware = (state: State) => FIRMWARE_UPGRADING_STATES.includes(state.upgradeState);
export const firmwareUpgradeFailed = (state: State) => state.upgradeState === FirmwareUpgradeStates.Failed;
export const firmwareUpgradeSuccess = (state: State) => state.upgradeState === FirmwareUpgradeStates.Success;
export const firmwareUpgradeState = (state: State): FirmwareUpgradeState => ({
    failReason: state.failReason,
    showForceFirmwareUpgrade: state.showForceFirmwareUpgrade,
    showForceFirmwareUpgradeWith: state.showForceFirmwareUpgradeWith,
    modules: state.modules,
    recoveryModules: state.recoveryModules
});

function mapModules(bundledFirmwareJson: FirmwareJson, firmwareJson: FirmwareJson, hardwareModules: HardwareModules): Array<ModuleFirmwareUpgradeState> {
    const modules: Array<ModuleFirmwareUpgradeState> = [
        {
            moduleName: RIGHT_HALF_FIRMWARE_UPGRADE_MODULE_NAME,
            firmwareUpgradeSupported: true,
            gitRepo: hardwareModules.rightModuleInfo.firmwareGitRepo,
            gitTag: hardwareModules.rightModuleInfo.firmwareGitTag,
            isOfficialFirmware: isOfficialUhkFirmware(hardwareModules.rightModuleInfo.firmwareGitRepo),
            currentFirmwareVersion: hardwareModules.rightModuleInfo?.firmwareVersion,
            newFirmwareVersion: firmwareJson?.firmwareVersion,
            state: ModuleFirmwareUpgradeStates.Idle
        }
    ];

    if (hardwareModules.moduleInfos) {
        for (const moduleInfo of hardwareModules.moduleInfos) {
            const jsonModule = bundledFirmwareJson.modules?.find(module => module.moduleId === moduleInfo.module.id);
            // If module info does not have checksum, it means that the firmware does not support this feature
            const checksumMismatches = moduleInfo.info.firmwareChecksum && jsonModule.md5 !== moduleInfo.info.firmwareChecksum;

            if (hardwareModules.rightModuleInfo?.firmwareVersion === moduleInfo.info.firmwareVersion || checksumMismatches) {
                modules.push({
                    moduleName: moduleInfo.module.name,
                    firmwareUpgradeSupported: moduleInfo.module.firmwareUpgradeSupported,
                    gitRepo: moduleInfo.info.firmwareGitRepo,
                    gitTag: moduleInfo.info.firmwareGitTag,
                    isOfficialFirmware: isOfficialUhkFirmware(moduleInfo.info.firmwareGitRepo),
                    currentFirmwareVersion: moduleInfo.info.firmwareVersion,
                    newFirmwareVersion: firmwareJson?.firmwareVersion,
                    state: ModuleFirmwareUpgradeStates.Idle,
                    tooltip: ''
                });
            } else {
                modules.push({
                    moduleName: moduleInfo.module.name,
                    firmwareUpgradeSupported: moduleInfo.module.firmwareUpgradeSupported,
                    gitRepo: hardwareModules.rightModuleInfo.firmwareGitRepo,
                    gitTag: hardwareModules.rightModuleInfo.firmwareGitTag,
                    isOfficialFirmware: isOfficialUhkFirmware(moduleInfo.info.firmwareGitRepo),
                    currentFirmwareVersion: hardwareModules.rightModuleInfo?.firmwareVersion,
                    newFirmwareVersion: '',
                    state: ModuleFirmwareUpgradeStates.Idle,
                    tooltip: `This module runs firmware ${moduleInfo.info.firmwareVersion}, but based on its checksum, it's the same as firmware ${bundledFirmwareJson.firmwareVersion}, hence it hasn't been updated. Unnecessary firmware updates might brick your UHK and modules in very rare circumstances, and make the firmware update process longer, so Agent only updates firmwares when justified.`
                });
            }
        }
    }

    return modules;
}

function calculateRecoveryModules(moduleInfos: Array<ModuleInfo>): Array<UhkModule> {
    let hasLeftSlotModule = false;
    let hasRightSlotModule = false;

    moduleInfos.forEach(moduleInfo => {
        switch (moduleInfo.module.slotId) {
            case ModuleSlotToId.leftModule:
                hasLeftSlotModule = true;
                break;

            case ModuleSlotToId.rightModule:
                hasRightSlotModule = true;
                break;

            default:
                break;
        }
    });

    return UHK_MODULES.reduce((result: Array<UhkModule>, module) => {
        if (module.firmwareUpgradeSupported ) {
            if (!hasLeftSlotModule && module.slotId === ModuleSlotToId.leftModule) {
                result.push(module);
            } else if (!hasRightSlotModule && module.slotId === ModuleSlotToId.rightModule) {
                result.push(module);
            }
        }

        return result;
    }, []);
}
