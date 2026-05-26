import { UHK_80_USER_CONFIG } from '../../user-config-80.js';

import { AdvancedSecondaryRoleConfiguration } from './advanced-secondary-role-configuration';
import { SecondaryRoleAdvancedStrategyTimeoutAction } from './secondary-role-advanced-strategy-timeout-action.js';
import { SecondaryRoleAdvancedStrategyTimeoutType } from './secondary-role-advanced-strategy-timeout-type.js';
import { SecondaryRoleAdvancedStrategyTriggeringEvent } from './secondary-role-advanced-strategy-triggering-event.js';
import { SecondaryRoleStrategy } from './secondary-role-strategy.js';

export const ADVANCED_SECONDARY_ROLE_CONFIGURATION_FIELD_NAMES: Array<keyof AdvancedSecondaryRoleConfiguration> = [
    'secondaryRoleAdvancedStrategyTimeout',
    'secondaryRoleAdvancedStrategyMinimumHoldTime',
    'secondaryRoleAdvancedStrategyTrigger',
    'secondaryRoleAdvancedStrategyTimeoutAction',
    'secondaryRoleAdvancedStrategyTimeoutType',
    'secondaryRoleAdvancedStrategySafetyMargin',
    'secondaryRoleAdvancedStrategyDoubletapToPrimary',
    'secondaryRoleAdvancedStrategyTriggerByMouse',
    'secondaryRoleAdvancedStrategyTriggerFromSameHalf'
]

export const ADVANCED_SECONDARY_ROLE_CONFIGURATION_FIELD_SET = new Set<keyof AdvancedSecondaryRoleConfiguration>(ADVANCED_SECONDARY_ROLE_CONFIGURATION_FIELD_NAMES)

export interface AdvancedSecondaryRoleConfigurationPreset {
    name: string;
    strategy: SecondaryRoleStrategy;
    tooltip: string;
    configuration: AdvancedSecondaryRoleConfiguration;
}

export const CUSTOM_ADVANCED_SECONDARY_ROLE_CONFIGURATION_PRESET_NAME = 'Custom';
export const CUSTOM_ADVANCED_SECONDARY_ROLE_TOOLTIP = 'your individual settings';
export const TIMEOUT_ADVANCED_SECONDARY_ROLE_CONFIGURATION_PRESET_NAME = 'Timeout';
export const SIMPLE_ADVANCED_SECONDARY_ROLE_CONFIGURATION_PRESET_NAME = 'Simple';

export const SIMPLE_ADVANCED_SECONDARY_ROLE_CONFIGURATION_PRESET: AdvancedSecondaryRoleConfigurationPreset = {
    name: SIMPLE_ADVANCED_SECONDARY_ROLE_CONFIGURATION_PRESET_NAME,
    strategy: SecondaryRoleStrategy.Simple,
    tooltip: 'hold while tapping another key for secondary, tap for primary',
    configuration: {
        secondaryRoleAdvancedStrategyTimeout: UHK_80_USER_CONFIG.secondaryRoleAdvancedStrategyTimeout, // TODO: Firngrod, can the timeout be disabled with the new implementation?
        secondaryRoleAdvancedStrategyMinimumHoldTime: UHK_80_USER_CONFIG.secondaryRoleAdvancedStrategyMinimumHoldTime,
        secondaryRoleAdvancedStrategyTimeoutAction: SecondaryRoleAdvancedStrategyTimeoutAction[UHK_80_USER_CONFIG.secondaryRoleAdvancedStrategyTimeoutAction],
        secondaryRoleAdvancedStrategyTimeoutType: SecondaryRoleAdvancedStrategyTimeoutType[UHK_80_USER_CONFIG.secondaryRoleAdvancedStrategyTimeoutType],
        secondaryRoleAdvancedStrategyTrigger: SecondaryRoleAdvancedStrategyTriggeringEvent[UHK_80_USER_CONFIG.secondaryRoleAdvancedStrategyTrigger],
        secondaryRoleAdvancedStrategySafetyMargin: UHK_80_USER_CONFIG.secondaryRoleAdvancedStrategySafetyMargin,
        secondaryRoleAdvancedStrategyDoubletapToPrimary: UHK_80_USER_CONFIG.secondaryRoleAdvancedStrategyDoubletapToPrimary,
        secondaryRoleAdvancedStrategyTriggerByMouse: UHK_80_USER_CONFIG.secondaryRoleAdvancedStrategyTriggerByMouse,
        secondaryRoleAdvancedStrategyTriggerFromSameHalf: UHK_80_USER_CONFIG.secondaryRoleAdvancedStrategyTriggerFromSameHalf,
    }
}

export const HRM_TIMEOUT_CANCEL_ADVANCED_SECONDARY_ROLE_CONFIGURATION_PRESET: AdvancedSecondaryRoleConfigurationPreset = {
    name: 'HRM-timeout-cancel',
    strategy: SecondaryRoleStrategy.Advanced,
    tooltip: 'hold while tapping another key for secondary, tap for primary, hold past timeout for no action',
    configuration: {
        secondaryRoleAdvancedStrategyTimeout: 300,
        secondaryRoleAdvancedStrategyMinimumHoldTime: 150,
        secondaryRoleAdvancedStrategyTimeoutAction: SecondaryRoleAdvancedStrategyTimeoutAction.None,
        secondaryRoleAdvancedStrategyTimeoutType: SecondaryRoleAdvancedStrategyTimeoutType.Passive,
        secondaryRoleAdvancedStrategyTrigger: SecondaryRoleAdvancedStrategyTriggeringEvent.Release,
        secondaryRoleAdvancedStrategySafetyMargin: -40,
        secondaryRoleAdvancedStrategyDoubletapToPrimary: false,
        secondaryRoleAdvancedStrategyTriggerByMouse: true,
        secondaryRoleAdvancedStrategyTriggerFromSameHalf: false,
    }
}

export const HRM_TIMEOUT_SECONDARY_ADVANCED_SECONDARY_ROLE_CONFIGURATION_PRESET: AdvancedSecondaryRoleConfigurationPreset = {
    name: 'HRM-timeout-secondary',
    strategy: SecondaryRoleStrategy.Advanced,
    tooltip: 'hold while tapping another key or hold past timeout for secondary, tap for primary',
    configuration: {
        secondaryRoleAdvancedStrategyTimeout: 350,
        secondaryRoleAdvancedStrategyMinimumHoldTime: 100,
        secondaryRoleAdvancedStrategyTimeoutAction: SecondaryRoleAdvancedStrategyTimeoutAction.Secondary,
        secondaryRoleAdvancedStrategyTimeoutType: SecondaryRoleAdvancedStrategyTimeoutType.Active,
        secondaryRoleAdvancedStrategyTrigger: SecondaryRoleAdvancedStrategyTriggeringEvent.Release,
        secondaryRoleAdvancedStrategySafetyMargin: 1,
        secondaryRoleAdvancedStrategyDoubletapToPrimary: true,
        secondaryRoleAdvancedStrategyTriggerByMouse: false,
        secondaryRoleAdvancedStrategyTriggerFromSameHalf: false,
    }
}

export const TIMEOUT_ADVANCED_SECONDARY_ROLE_CONFIGURATION_PRESET: AdvancedSecondaryRoleConfigurationPreset = {
    name: TIMEOUT_ADVANCED_SECONDARY_ROLE_CONFIGURATION_PRESET_NAME,
    strategy: SecondaryRoleStrategy.Advanced,
    tooltip: 'hold until timeout for secondary, briefly tap for primary',
    configuration: {
        secondaryRoleAdvancedStrategyTimeout: 200,
        secondaryRoleAdvancedStrategyMinimumHoldTime: 150,
        secondaryRoleAdvancedStrategyTimeoutAction: SecondaryRoleAdvancedStrategyTimeoutAction.Secondary,
        secondaryRoleAdvancedStrategyTimeoutType: SecondaryRoleAdvancedStrategyTimeoutType.Active,
        secondaryRoleAdvancedStrategyTrigger: SecondaryRoleAdvancedStrategyTriggeringEvent.None,
        secondaryRoleAdvancedStrategySafetyMargin: 0,
        secondaryRoleAdvancedStrategyDoubletapToPrimary: true,
        secondaryRoleAdvancedStrategyTriggerByMouse: true,
        secondaryRoleAdvancedStrategyTriggerFromSameHalf: true,
    }
}

export const BUILTIN_ADVANCED_SECONDARY_ROLE_CONFIGURATION_PRESETS: AdvancedSecondaryRoleConfigurationPreset[] = [
    SIMPLE_ADVANCED_SECONDARY_ROLE_CONFIGURATION_PRESET,
    HRM_TIMEOUT_CANCEL_ADVANCED_SECONDARY_ROLE_CONFIGURATION_PRESET,
    HRM_TIMEOUT_SECONDARY_ADVANCED_SECONDARY_ROLE_CONFIGURATION_PRESET,
    TIMEOUT_ADVANCED_SECONDARY_ROLE_CONFIGURATION_PRESET,
];
