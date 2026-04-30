import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { faSlidersH } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import {
    AdvancedSecondaryRoleConfiguration,
    SecondaryRoleStrategy,
    SecondaryRoleAdvancedStrategyTimeoutAction,
    SecondaryRoleAdvancedStrategyTimeoutType,
    SecondaryRoleAdvancedStrategyTriggeringEvent,
} from 'uhk-common';

import { TypingBehaviorPreset } from '../../../models/typing-behavior-preset';
import { AppState, calculateTypingBehaviorPresets, getUserConfiguration } from '../../../store';
import {
    LoadTypingBehaviorPresetAction,
    SetUserConfigurationValueAction,
} from '../../../store/actions/user-config';

@Component({
    selector: 'typing-behavior-page',
    standalone: false,
    templateUrl: './typing-behavior-page.component.html',
    styleUrls: ['./typing-behavior-page.component.scss'],
    host: {
        'class': 'container-fluid d-block'
    }
})
export class TypingBehaviorPage implements AdvancedSecondaryRoleConfiguration, OnInit, OnDestroy {
    faSlidersH = faSlidersH;
    SecondaryRoleAdvancedStrategyTriggeringEvent = SecondaryRoleAdvancedStrategyTriggeringEvent;

    secondaryRoleStrategy = SecondaryRoleStrategy.Simple;
    secondaryRoleAdvancedStrategyTimeout = 350;
    secondaryRoleAdvancedStrategyTimeoutAction = SecondaryRoleAdvancedStrategyTimeoutAction.Secondary;
    secondaryRoleAdvancedStrategyTimeoutType = SecondaryRoleAdvancedStrategyTimeoutType.Active;
    secondaryRoleAdvancedStrategyTrigger = SecondaryRoleAdvancedStrategyTriggeringEvent.Release;
    secondaryRoleAdvancedStrategySafetyMargin = 50;
    secondaryRoleAdvancedStrategyDoubletapToPrimary = true;
    secondaryRoleAdvancedStrategyTriggerByMouse = false;
    secondaryRoleAdvancedStrategyTriggerFromSameHalf = true;
    secondaryRoleAdvancedStrategyMinimumHoldTime = 0;

    doubletapTimeout = 400;
    keystrokeDelay = 0;

    typingBehaviorPresets: TypingBehaviorPreset[] = []

    timeoutActionActionDropdownOptions = [
        {
            id: SecondaryRoleAdvancedStrategyTimeoutAction.Primary,
            text: 'Primary'
        },
        {
            id: SecondaryRoleAdvancedStrategyTimeoutAction.Secondary,
            text: 'Secondary'
        },
        {
            id: SecondaryRoleAdvancedStrategyTimeoutAction.None,
            text: 'None'
        }
    ]

    timeoutActionTypeDropdownOptions = [
        {
            id: SecondaryRoleAdvancedStrategyTimeoutType.Active,
            text: 'activated immediately'
        },
        {
            id: SecondaryRoleAdvancedStrategyTimeoutType.Passive,
            text: 'on uninterrupted release'
        },
    ]

    private userConfigSubscription: Subscription;
    private typingBehaviorPresetsSubscription: Subscription;

    constructor(private store: Store<AppState>,
        private cdRef: ChangeDetectorRef) {}

    ngOnInit(): void {
        this.userConfigSubscription = this.store.select(getUserConfiguration)
            .subscribe(config => {
                this.secondaryRoleStrategy = config.secondaryRoleStrategy;
                this.secondaryRoleAdvancedStrategyTimeout = config.secondaryRoleAdvancedStrategyTimeout;
                this.secondaryRoleAdvancedStrategyTimeoutAction = config.secondaryRoleAdvancedStrategyTimeoutAction;
                this.secondaryRoleAdvancedStrategyTrigger = config.secondaryRoleAdvancedStrategyTrigger;
                this.secondaryRoleAdvancedStrategySafetyMargin = config.secondaryRoleAdvancedStrategySafetyMargin;
                this.secondaryRoleAdvancedStrategyDoubletapToPrimary = config.secondaryRoleAdvancedStrategyDoubletapToPrimary;
                this.secondaryRoleAdvancedStrategyTriggerByMouse = config.secondaryRoleAdvancedStrategyTriggerByMouse;
                this.secondaryRoleAdvancedStrategyTriggerFromSameHalf = config.secondaryRoleAdvancedStrategyTriggerFromSameHalf;
                this.secondaryRoleAdvancedStrategyMinimumHoldTime = config.secondaryRoleAdvancedStrategyMinimumHoldTime;
                this.secondaryRoleAdvancedStrategyTimeoutType = config.secondaryRoleAdvancedStrategyTimeoutType;

                this.doubletapTimeout = config.doubletapTimeout;
                this.keystrokeDelay = config.keystrokeDelay;

                this.cdRef.detectChanges();
            });
        this.typingBehaviorPresetsSubscription = this.store.select(calculateTypingBehaviorPresets)
            .subscribe(presets => {
                this.typingBehaviorPresets = presets;
                this.cdRef.detectChanges();
            })
    }

    ngOnDestroy(): void {
        if (this.userConfigSubscription) {
            this.userConfigSubscription.unsubscribe();
        }
        this.typingBehaviorPresetsSubscription?.unsubscribe();
    }

    onLoadPreset(name: string): void {
        this.store.dispatch(new LoadTypingBehaviorPresetAction(name));
    }

    onSetPropertyValue(propertyName: string, value: number): void {
        // The slider fires a change event after preset loaded otherwise it Changes the Simple preset to Advanced
        if (this[propertyName] === value) {
            return;
        }

        this.store.dispatch(new SetUserConfigurationValueAction({
            propertyName,
            value
        }));
    }

    trackPresets(index: number, preset: TypingBehaviorPreset): string {
        return preset.name;
    }
}
