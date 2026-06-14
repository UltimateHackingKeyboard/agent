import { SecondaryRoleAdvancedStrategyTimeoutAction } from './secondary-role-advanced-strategy-timeout-action.js';
import { SecondaryRoleAdvancedStrategyTimeoutType } from './secondary-role-advanced-strategy-timeout-type.js';
import { SecondaryRoleAdvancedStrategyTriggeringEvent } from './secondary-role-advanced-strategy-triggering-event.js';

export interface AdvancedSecondaryRoleConfiguration {
    secondaryRoleAdvancedStrategyTimeout: number;
    secondaryRoleAdvancedStrategyMinimumHoldTime: number;
    secondaryRoleAdvancedStrategyTrigger: SecondaryRoleAdvancedStrategyTriggeringEvent;
    secondaryRoleAdvancedStrategyTimeoutAction: SecondaryRoleAdvancedStrategyTimeoutAction;
    secondaryRoleAdvancedStrategyTimeoutType: SecondaryRoleAdvancedStrategyTimeoutType;
    secondaryRoleAdvancedStrategySafetyMargin: number;
    secondaryRoleAdvancedStrategyDoubletapToPrimary: boolean;
    secondaryRoleAdvancedStrategyTriggerByMouse: boolean;
    secondaryRoleAdvancedStrategyTriggerFromSameHalf: boolean;
}
