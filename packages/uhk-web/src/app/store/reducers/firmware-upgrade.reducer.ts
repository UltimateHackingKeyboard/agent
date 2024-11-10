import { Action } from '@ngrx/store';
import {
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
import { appendXtermLogs } from '../../util/merge-xterm-logs';

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
    firmwareJson?: FirmwareJson;
    hardwareModules: HardwareModules;
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
    hardwareModules: {},
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
                hardwareModules,
                modules: mapModules(state.firmwareJson, hardwareModules, state.modules),
                recoveryModules: calculateRecoveryModules(hardwareModules.moduleInfos)
            };
        }

        case Device.ActionTypes.CurrentlyUpdatingModule: {
            return {
                ...state,
                modules: setUpdatingModuleState(state, (action as Device.CurrentlyUpdatingModuleAction).payload),
                upgradedModule: true
            };
        }

        case Device.ActionTypes.CurrentlyUpdateSkipModule: {
            return {
                ...state,
                modules: setUpdatingModuleState(state, (action as Device.CurrentlyUpdateSkipModuleAction).payload),
            };
        }

        case Device.ActionTypes.ModulesInfoLoaded: {
            const hardwareModules = (action as Device.HardwareModulesLoadedAction).payload;

            return {
                ...state,
                hardwareModules,
                modules: mapModules(state.firmwareJson, hardwareModules, state.modules),
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

        case App.ActionTypes.ElectronMainLogReceived: {
            if (!FIRMWARE_UPGRADING_STATES.includes(state.upgradeState)) {
                return state;
            }

            const payload = (action as App.ElectronMainLogReceivedAction).payload;

            if (payload.message.indexOf('UHK Device not found:') > -1) {
                return state;
            }

            return {
                ...state,
                log: appendXtermLogs(state.log, payload),
            };
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

function mapModules(firmwareJson: FirmwareJson, hardwareModules: HardwareModules, stateModules: Array<ModuleFirmwareUpgradeState> = []): Array<ModuleFirmwareUpgradeState> {
    const modules: Array<ModuleFirmwareUpgradeState> = [
        {
            moduleName: RIGHT_HALF_FIRMWARE_UPGRADE_MODULE_NAME,
            firmwareUpgradeSupported: true,
            gitRepo: hardwareModules.rightModuleInfo.firmwareGitRepo,
            gitTag: hardwareModules.rightModuleInfo.firmwareGitTag,
            isOfficialFirmware: isOfficialUhkFirmware(hardwareModules.rightModuleInfo.firmwareGitRepo),
            currentFirmwareVersion: hardwareModules.rightModuleInfo?.firmwareVersion,
            newFirmwareVersion: firmwareJson?.firmwareVersion,
            state: stateModules[0]?.state ?? ModuleFirmwareUpgradeStates.Idle
        }
    ];

    if (hardwareModules.moduleInfos) {
        for (let i = 0; i < hardwareModules.moduleInfos?.length; i++) {
            const moduleInfo = hardwareModules.moduleInfos[i];
            const firmwareModuleInfo =  hardwareModules.rightModuleInfo.modules[moduleInfo.module.id];
            const stateModule = stateModules.find(stateModule => stateModule.moduleName === moduleInfo.module.name);

            if (!firmwareModuleInfo || moduleInfo.info.firmwareVersion === hardwareModules.rightModuleInfo?.firmwareVersion || firmwareModuleInfo.md5 !== moduleInfo.info.firmwareChecksum) {
                modules.push({
                    moduleName: moduleInfo.module.name,
                    firmwareUpgradeSupported: moduleInfo.module.firmwareUpgradeSupported,
                    gitRepo: moduleInfo.info.firmwareGitRepo,
                    gitTag: moduleInfo.info.firmwareGitTag,
                    isOfficialFirmware: isOfficialUhkFirmware(moduleInfo.info.firmwareGitRepo),
                    currentFirmwareVersion: moduleInfo.info.firmwareVersion,
                    newFirmwareVersion: firmwareJson?.firmwareVersion,
                    state: stateModule?.state ?? ModuleFirmwareUpgradeStates.Idle,
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
                    state: stateModule?.state ?? ModuleFirmwareUpgradeStates.Idle,
                    tooltip: `This module runs firmware ${hardwareModules.rightModuleInfo?.firmwareVersion} (binary identical to previously installed firmware ${moduleInfo.info.firmwareVersion}); no update needed.`
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

function setUpdatingModuleState(state: State, moduleName: string): Array<ModuleFirmwareUpgradeState> {
    return state.modules.map(module => {
        if (module.moduleName === moduleName) {
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
    });
}
