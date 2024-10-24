import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { BacklightingOption } from '../../../models/index';
import { AppState, getBacklightingOptions, getConnectedDevice, getUserConfiguration } from '../../../store';
import {
    SetUserConfigurationRgbValueAction,
    SetUserConfigurationValueAction
} from '../../../store/actions/user-config';
import { Observable, Subscription } from 'rxjs';
import { faSlidersH } from '@fortawesome/free-solid-svg-icons';
import { BacklightingMode, RgbColorInterface, UHK_80_DEVICE, UserConfiguration } from 'uhk-common';

@Component({
    selector: 'device-led-settings',
    templateUrl: './led-settings.component.html',
    styleUrls: ['./led-settings.component.scss'],
    host: {
        'class': 'container-fluid'
    }
})
export class LEDSettingsComponent implements OnInit, OnDestroy {
    backlightingMode = BacklightingMode.FunctionalBacklighting;
    backlightingNoneActionColor: RgbColorInterface;
    backlightingScancodeColor: RgbColorInterface;
    backlightingModifierColor: RgbColorInterface;
    backlightingShortcutColor: RgbColorInterface;
    backlightingSwitchLayerColor: RgbColorInterface;
    backlightingSwitchKeymapColor: RgbColorInterface;
    backlightingMouseColor: RgbColorInterface;
    backlightingMacroColor: RgbColorInterface;

    backlightingOptions: Array<BacklightingOption>;

    displayBrightness = 255;
    displayBrightnessBattery = 255;
    keyBacklightBrightness = 255;
    keyBacklightBrightnessBattery = 255;
    displayFadeOutTimeout = 0;
    displayFadeOutBatteryTimeout = 0;
    keyBacklightFadeOutTimeout = 0;
    keyBacklightFadeOutBatteryTimeout = 0;

    faSlidersH = faSlidersH;
    showBatteryPoweredColumn = false;

    private userConfig$: Observable<UserConfiguration>;
    private userConfigSubscription: Subscription;
    private backlightingOptionsSubscription: Subscription;
    private connectedDeviceSubscription: Subscription;

    constructor(private store: Store<AppState>,
                private cdRef: ChangeDetectorRef) {}

    ngOnInit() {
        this.userConfig$ = this.store.select(getUserConfiguration);
        this.userConfigSubscription = this.userConfig$.subscribe(config => {
            this.displayBrightness = config.displayBrightness;
            this.displayBrightnessBattery = config.displayBrightnessBattery;
            this.keyBacklightBrightness = config.keyBacklightBrightness;
            this.keyBacklightBrightnessBattery = config.keyBacklightBrightnessBattery;
            this.displayFadeOutTimeout = config.displayFadeOutTimeout;
            this.displayFadeOutBatteryTimeout = config.displayFadeOutBatteryTimeout;
            this.keyBacklightFadeOutTimeout = config.keyBacklightFadeOutTimeout;
            this.keyBacklightFadeOutBatteryTimeout = config.keyBacklightFadeOutBatteryTimeout;

            this.backlightingMode = config.backlightingMode;
            this.backlightingNoneActionColor = config.backlightingNoneActionColor.toJsonObject();
            this.backlightingScancodeColor = config.backlightingScancodeColor.toJsonObject();
            this.backlightingModifierColor = config.backlightingModifierColor.toJsonObject();
            this.backlightingShortcutColor = config.backlightingShortcutColor.toJsonObject();
            this.backlightingSwitchLayerColor = config.backlightingSwitchLayerColor.toJsonObject();
            this.backlightingSwitchKeymapColor = config.backlightingSwitchKeymapColor.toJsonObject();
            this.backlightingMouseColor = config.backlightingMouseColor.toJsonObject();
            this.backlightingMacroColor = config.backlightingMacroColor.toJsonObject();
            this.cdRef.detectChanges();
        });
        this.backlightingOptionsSubscription = this.store.select(getBacklightingOptions)
            .subscribe(options => {
                this.backlightingOptions = options;
                this.cdRef.detectChanges();
            });
        this.connectedDeviceSubscription = this.store.select(getConnectedDevice)
            .subscribe(connectedDevice => {
                this.showBatteryPoweredColumn = connectedDevice?.id === UHK_80_DEVICE.id;
                this.cdRef.detectChanges();
            });
    }

    ngOnDestroy() {
        this.connectedDeviceSubscription?.unsubscribe();
        this.userConfigSubscription.unsubscribe();
        if (this.backlightingOptionsSubscription) {
            this.backlightingOptionsSubscription.unsubscribe();
        }
    }

    onSetPropertyValue(propertyName: string, value: number): void {
        this.store.dispatch(new SetUserConfigurationValueAction({
            propertyName,
            value
        }));
    }

    onSetRgbValue(propertyName: string, value: RgbColorInterface): void {
        this.store.dispatch(new SetUserConfigurationRgbValueAction({
            propertyName,
            value
        }));
    }
}
