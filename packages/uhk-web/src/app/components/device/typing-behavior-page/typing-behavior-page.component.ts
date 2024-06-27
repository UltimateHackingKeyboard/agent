import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { faSlidersH } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import {
    SecondaryRoleStrategy,
    SecondaryRoleAdvancedStrategyTimeoutAction,
} from 'uhk-common';

import { AppState, getUserConfiguration } from '../../../store';
import { SetUserConfigurationValueAction } from '../../../store/actions/user-config';

@Component({
    selector: 'typing-behavior-page',
    templateUrl: './typing-behavior-page.component.html',
    styleUrls: ['./typing-behavior-page.component.scss'],
    host: {
        'class': 'container-fluid d-block'
    }
})
export class TypingBehaviorPage implements OnInit, OnDestroy {
    faSlidersH = faSlidersH;
    SecondaryRoleStrategy = SecondaryRoleStrategy;
    SecondaryRoleAdvancedStrategyTimeoutAction = SecondaryRoleAdvancedStrategyTimeoutAction;

    secondaryRoleStrategy = SecondaryRoleStrategy.Simple;
    secondaryRoleAdvancedStrategyTimeout = 350;
    secondaryRoleAdvancedStrategyTimeoutAction = SecondaryRoleAdvancedStrategyTimeoutAction.Secondary;
    secondaryRoleAdvancedStrategyTriggerByRelease = true;
    secondaryRoleAdvancedStrategySafetyMargin = 50;
    secondaryRoleAdvancedStrategyDoubletapToPrimary = true;
    secondaryRoleAdvancedStrategyDoubletapTimeout = 200;

    doubletapTimeout = 400;
    keystrokeDelay = 0;

    private userConfigSubscription: Subscription;

    constructor(private store: Store<AppState>,
        private cdRef: ChangeDetectorRef) {}

    ngOnInit(): void {
        this.userConfigSubscription = this.store.select(getUserConfiguration)
            .subscribe(config => {
                this.secondaryRoleStrategy = config.secondaryRoleStrategy;
                this.secondaryRoleAdvancedStrategyTimeout = config.secondaryRoleAdvancedStrategyTimeout;
                this.secondaryRoleAdvancedStrategyTimeoutAction = config.secondaryRoleAdvancedStrategyTimeoutAction;
                this.secondaryRoleAdvancedStrategyTriggerByRelease = config.secondaryRoleAdvancedStrategyTriggerByRelease;
                this.secondaryRoleAdvancedStrategySafetyMargin = config.secondaryRoleAdvancedStrategySafetyMargin;
                this.secondaryRoleAdvancedStrategyDoubletapToPrimary = config.secondaryRoleAdvancedStrategyDoubletapToPrimary;
                this.secondaryRoleAdvancedStrategyDoubletapTimeout = config.secondaryRoleAdvancedStrategyDoubletapTimeout;

                this.doubletapTimeout = config.doubletapTimeout;
                this.keystrokeDelay = config.keystrokeDelay;

                this.cdRef.detectChanges();
            });
    }

    ngOnDestroy(): void {
        if (this.userConfigSubscription) {
            this.userConfigSubscription.unsubscribe();
        }
    }

    onSetPropertyValue(propertyName: string, value: number): void {
        this.store.dispatch(new SetUserConfigurationValueAction({
            propertyName,
            value
        }));
    }
}
