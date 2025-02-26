import { Action } from '@ngrx/store';
import {
    CurrentlyUpdatingModuleInfo,
    Dongle,
    FirmwareJson,
    FirmwareUpgradeFailReason,
    HardwareModules,
    isOfficialUhkFirmware,
    ModuleFirmwareUpgradeSkipReason,
    ModuleInfo,
    ModuleSlotToId,
    RIGHT_HALF_FIRMWARE_UPGRADE_MODULE_NAME,
    UhkDeviceProduct,
    UHK_DONGLE,
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
    connectedDevice?: UhkDeviceProduct;
    dongle?: Dongle;
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
                    checksumTooltip: '',
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
            const payload = (action as Device.ConnectionStateChangedAction).payload;
            const hardwareModules = payload.hardwareModules;

            return {
                ...state,
                connectedDevice: payload.connectedDevice,
                dongle: payload.dongle,
                hardwareModules,
                modules: mapModules(state.firmwareJson, hardwareModules, state.modules, payload.dongle, state.connectedDevice),
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
            const payload = (action as Device.CurrentlyUpdateSkipModuleAction).payload;

            return {
                ...state,
                modules: state.modules.map(module => {
                    if (module.moduleName === payload.moduleName) {
                        const newState = {
                            ...module,
                            beforeFirmwareUpgradeChecksum: module.currentFirmwareChecksum,
                            newFirmwareChecksum: payload.newFirmwareChecksum,
                            state: ModuleFirmwareUpgradeStates.Skipped,
                            skipReason: payload.reason,
                        }
                        newState.checksumTooltip = calculateChecksumTooltip(newState)

                        return newState;
                    }

                    if (module.state === ModuleFirmwareUpgradeStates.Upgrading) {
                        return updateUpgradingModuleState(state, module, payload);
                    }

                    return module;
                }),
            };
        }

        case Device.ActionTypes.DongleVersionInfoLoaded: {
            const versionInfo = (action as Device.DongleVersionInfoLoadedAction).payload;

            const dongle = {
                ...state.dongle,
                versionInfo
            };

            return {
                ...state,
                dongle,
                modules: mapModules(state.firmwareJson, state.hardwareModules, state.modules, state.dongle, state.connectedDevice),
            };
        }

        case Device.ActionTypes.ModulesInfoLoaded: {
            const hardwareModules = (action as Device.HardwareModulesLoadedAction).payload;

            return {
                ...state,
                hardwareModules,
                modules: mapModules(state.firmwareJson, hardwareModules, state.modules, state.dongle, state.connectedDevice),
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

function mapModules(firmwareJson: FirmwareJson, hardwareModules: HardwareModules, stateModules: Array<ModuleFirmwareUpgradeState> = [], dongle: Dongle, connectedDevice: UhkDeviceProduct): Array<ModuleFirmwareUpgradeState> {
    const modules: Array<ModuleFirmwareUpgradeState> = [];

    function findStateModule(name: string): ModuleFirmwareUpgradeState {
        return stateModules.find(module => module.moduleName === name);
    }

    if (dongle?.versionInfo) {
        const stateModule = findStateModule(UHK_DONGLE.name)
        const dongleState: ModuleFirmwareUpgradeState = {
            moduleName: UHK_DONGLE.name,
            firmwareUpgradeSupported: true,
            gitRepo: dongle.versionInfo.firmwareGitRepo,
            gitTag: dongle.versionInfo.firmwareGitTag,
            isOfficialFirmware: isOfficialUhkFirmware(dongle.versionInfo.firmwareGitRepo),
            currentFirmwareChecksum: dongle.versionInfo?.builtFirmwareChecksum,
            currentFirmwareVersion: dongle.versionInfo?.firmwareVersion,
            newFirmwareVersion: dongle.versionInfo?.firmwareVersion,
            beforeFirmwareUpgradeChecksum: stateModule?.beforeFirmwareUpgradeChecksum,
            newFirmwareChecksum: stateModule?.newFirmwareChecksum,
            forceUpgraded: stateModule?.forceUpgraded,
            skipReason: stateModule?.skipReason,
            state: stateModule?.state ?? ModuleFirmwareUpgradeStates.Idle,
        }
        dongleState.checksumTooltip = calculateChecksumTooltip(dongleState)

        modules.push(dongleState);
    }

    if (connectedDevice) {
        const stateModule = findStateModule(RIGHT_HALF_FIRMWARE_UPGRADE_MODULE_NAME)
        const rightDeviceState: ModuleFirmwareUpgradeState = {
            moduleName: RIGHT_HALF_FIRMWARE_UPGRADE_MODULE_NAME,
            firmwareUpgradeSupported: true,
            gitRepo: hardwareModules.rightModuleInfo.firmwareGitRepo,
            gitTag: hardwareModules.rightModuleInfo.firmwareGitTag,
            isOfficialFirmware: isOfficialUhkFirmware(hardwareModules.rightModuleInfo.firmwareGitRepo),
            currentFirmwareChecksum: hardwareModules.rightModuleInfo.builtFirmwareChecksum,
            currentFirmwareVersion: hardwareModules.rightModuleInfo?.firmwareVersion,
            beforeFirmwareUpgradeChecksum: stateModule?.beforeFirmwareUpgradeChecksum,
            newFirmwareVersion: firmwareJson?.firmwareVersion,
            newFirmwareChecksum: stateModule?.newFirmwareChecksum,
            forceUpgraded: stateModule?.forceUpgraded,
            skipReason: stateModule?.skipReason,
            state: stateModule?.state ?? ModuleFirmwareUpgradeStates.Idle,
        }
        rightDeviceState.checksumTooltip = calculateChecksumTooltip(rightDeviceState)

        modules.push(rightDeviceState);
    }

    if (hardwareModules.moduleInfos) {
        for (let i = 0; i < hardwareModules.moduleInfos?.length; i++) {
            const moduleInfo = hardwareModules.moduleInfos[i];
            const firmwareModuleInfo =  hardwareModules.rightModuleInfo.modules[moduleInfo.module.id];
            const stateModule = findStateModule(moduleInfo.module.name);
            let moduleState: ModuleFirmwareUpgradeState;


            if (!firmwareModuleInfo || moduleInfo.info.firmwareVersion === hardwareModules.rightModuleInfo?.firmwareVersion || firmwareModuleInfo.builtFirmwareChecksum !== moduleInfo.info.remoteFirmwareChecksum) {
                moduleState = {
                    moduleName: moduleInfo.module.name,
                    firmwareUpgradeSupported: moduleInfo.module.firmwareUpgradeSupported,
                    gitRepo: moduleInfo.info.firmwareGitRepo,
                    gitTag: moduleInfo.info.firmwareGitTag,
                    isOfficialFirmware: isOfficialUhkFirmware(moduleInfo.info.firmwareGitRepo),
                    currentFirmwareChecksum: moduleInfo.info.remoteFirmwareChecksum,
                    currentFirmwareVersion: moduleInfo.info.firmwareVersion,
                    newFirmwareVersion: firmwareJson?.firmwareVersion,
                    beforeFirmwareUpgradeChecksum: stateModule?.beforeFirmwareUpgradeChecksum,
                    newFirmwareChecksum: stateModule?.newFirmwareChecksum,
                    forceUpgraded: stateModule?.forceUpgraded,
                    skipReason: stateModule?.skipReason,
                    state: stateModule?.state ?? ModuleFirmwareUpgradeStates.Idle,
                    tooltip: '',
                }

                modules.push(moduleState);
            } else {
                moduleState = {
                    moduleName: moduleInfo.module.name,
                    firmwareUpgradeSupported: moduleInfo.module.firmwareUpgradeSupported,
                    gitRepo: hardwareModules.rightModuleInfo.firmwareGitRepo,
                    gitTag: hardwareModules.rightModuleInfo.firmwareGitTag,
                    isOfficialFirmware: isOfficialUhkFirmware(moduleInfo.info.firmwareGitRepo),
                    currentFirmwareChecksum: moduleInfo.info.remoteFirmwareChecksum,
                    currentFirmwareVersion: hardwareModules.rightModuleInfo?.firmwareVersion,
                    newFirmwareVersion: '',
                    beforeFirmwareUpgradeChecksum: stateModule?.beforeFirmwareUpgradeChecksum,
                    newFirmwareChecksum: stateModule?.newFirmwareChecksum,
                    forceUpgraded: stateModule?.forceUpgraded,
                    skipReason: stateModule?.skipReason,
                    state: stateModule?.state ?? ModuleFirmwareUpgradeStates.Idle,
                    tooltip: `This module runs firmware ${hardwareModules.rightModuleInfo?.firmwareVersion} (binary identical to previously installed firmware ${moduleInfo.info.firmwareVersion}); no update needed.`,
                }

                modules.push(moduleState);
            }

            moduleState.checksumTooltip = calculateChecksumTooltip(moduleState);
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

function setUpdatingModuleState(state: State, payload: CurrentlyUpdatingModuleInfo): Array<ModuleFirmwareUpgradeState> {
    return state.modules.map(module => {
        if (module.moduleName === payload.moduleName) {
            const newState = {
                ...module,
                beforeFirmwareUpgradeChecksum: module.currentFirmwareChecksum,
                forceUpgraded: payload.forceUpgraded,
                newFirmwareChecksum: payload.newFirmwareChecksum,
                state: ModuleFirmwareUpgradeStates.Upgrading,
            };
            newState.checksumTooltip = calculateChecksumTooltip(newState);

            return newState;
        }

        if (module.state === ModuleFirmwareUpgradeStates.Upgrading) {
            return updateUpgradingModuleState(state, module, payload);
        }

        return module;
    });
}

function updateUpgradingModuleState(state: State, module: ModuleFirmwareUpgradeState, payload: {newFirmwareChecksum: string}): ModuleFirmwareUpgradeState {
    const newState = {
        ...module,
        state: ModuleFirmwareUpgradeStates.Success,
        newFirmwareChecksum: payload.newFirmwareChecksum,
        newFirmwareVersion: state.firmwareJson?.firmwareVersion,
        currentFirmwareVersion: state.firmwareJson?.firmwareVersion,
        gitRepo: state.firmwareJson?.gitInfo?.repo,
        gitTag: state.firmwareJson?.gitInfo?.tag,
    };
    newState.checksumTooltip = calculateChecksumTooltip(newState);

    return newState;
}

function calculateChecksumTooltip(upgradeState: ModuleFirmwareUpgradeState): string {
    if (upgradeState.state === ModuleFirmwareUpgradeStates.Upgrading) {
        if (upgradeState.forceUpgraded) {
            return `Force upgrading, even though expected checksum (${upgradeState.newFirmwareChecksum}) is equal to actual checksum (${upgradeState.beforeFirmwareUpgradeChecksum})`;
        }
        else {
            return `Upgrading because expected checksum (${upgradeState.newFirmwareChecksum}) is not equal to actual checksum (${upgradeState.beforeFirmwareUpgradeChecksum})`;
        }
    }
    else if (upgradeState.state === ModuleFirmwareUpgradeStates.Skipped) {
        if (upgradeState.skipReason === ModuleFirmwareUpgradeSkipReason.ModuleChecksumMatches || upgradeState.skipReason === ModuleFirmwareUpgradeSkipReason.DeviceChecksumMatches) {
            return `Not upgraded because expected checksum (${upgradeState.newFirmwareChecksum}) was equal to actual checksum (${upgradeState.beforeFirmwareUpgradeChecksum})`;
        }

        if (upgradeState.skipReason === ModuleFirmwareUpgradeSkipReason.Uhk80Limitation) {
            return 'The UHK 80 firmware can\'t update module firmwares yet, but it\'s not a problem because module firmwares haven\'t changed.';
        }
    }
    else if (upgradeState.state === ModuleFirmwareUpgradeStates.Success) {
        if (upgradeState.forceUpgraded) {
            return `Force upgraded, even though expected checksum (${upgradeState.newFirmwareChecksum}) was equal to actual checksum (${upgradeState.beforeFirmwareUpgradeChecksum})`;
        }
        else {
            return `Upgraded because expected checksum (${upgradeState.newFirmwareChecksum}) was not equal to actual checksum (${upgradeState.beforeFirmwareUpgradeChecksum})`;
        }
    }
    else if (upgradeState.state === ModuleFirmwareUpgradeStates.Failed) {
        if (upgradeState.forceUpgraded) {
            return `Force upgrade failed, expected checksum (${upgradeState.newFirmwareChecksum}) is equal to actual checksum (${upgradeState.beforeFirmwareUpgradeChecksum})`;
        }
        else {
            return `Upgrade failed, expected checksum (${upgradeState.newFirmwareChecksum}) is not equal to actual checksum (${upgradeState.beforeFirmwareUpgradeChecksum})`;
        }
    }

    return;
}
