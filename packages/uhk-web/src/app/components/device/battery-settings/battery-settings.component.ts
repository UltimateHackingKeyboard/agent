import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { BatteryChargingMode } from 'uhk-common';

import { faBatteryFull } from '../../../custom-fa-icons/index';
import { SetUserConfigurationValueAction } from '../../../store/actions/user-config';
import { AppState, getUserConfiguration } from '../../../store/index';

@Component({
    selector: 'battery-settings',
    standalone: false,
    templateUrl: './battery-settings.component.html',
    styleUrls: ['./battery-settings.component.scss'],
    host: {
        'class': 'container-fluid'
    }
})
export class BatterySettingsComponent implements OnInit, OnDestroy{
    faBatteryFull = faBatteryFull;
    keyBacklightBrightnessChargingDefault = 50;
    extendBatteryLife = false;

    private userConfigSubscription: Subscription;

    constructor(private store: Store<AppState>,
                private cdRef: ChangeDetectorRef) {
    }

    ngOnInit(): void {
        this.userConfigSubscription = this.store.select(getUserConfiguration)
            .subscribe(config => {
                this.keyBacklightBrightnessChargingDefault = config.keyBacklightBrightnessChargingDefault
                this.extendBatteryLife = config.batteryChargingMode === BatteryChargingMode.Stationary;
                this.cdRef.detectChanges();
            })
    }

    ngOnDestroy(): void {
        this.userConfigSubscription?.unsubscribe();
    }

    onSetPropertyValue(propertyName: string, value: number): void {
        this.store.dispatch(new SetUserConfigurationValueAction({
            propertyName,
            value
        }));
    }

    toggleExtendBatteryLife(extend: boolean): void {
        this.store.dispatch(new SetUserConfigurationValueAction({
            propertyName: 'batteryChargingMode',
            value: extend ? BatteryChargingMode.Stationary : BatteryChargingMode.Full
        }));
    }
}
