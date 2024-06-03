import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { BacklightingOption } from '../../../models/index';
import { AppState, getBacklightingOptions, getUserConfiguration } from '../../../store';
import {
    SetUserConfigurationRgbValueAction,
    SetUserConfigurationValueAction
} from '../../../store/actions/user-config';
import { Observable, Subscription } from 'rxjs';
import { faSlidersH } from '@fortawesome/free-solid-svg-icons';
import { BacklightingMode, RgbColorInterface, UserConfiguration } from 'uhk-common';

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
    ledsFadeTimeout = 0;

    public iconsAndLayerTextsBrightness: number = 0;
    public alphanumericSegmentsBrightness: number = 0;
    public keyBacklightBrightness: number = 0;
    faSlidersH = faSlidersH;

    fadeTimeoutSliderConfig = {
        pips: {
            density: 3,
            format: {
                // format special values
                to: (value: number) => {
                    switch (value) {
                        case 60:
                            return '1m';

                        case 600:
                            return '10m';

                        case 1800:
                            return '30m';

                        case 3600:
                            return '1h';

                        default:
                            return value;
                    }
                }
            },
            mode: 'range',
        },
        range: {
            min: [0], // from 0 to 60 sec the step is 1 sec
            '25%': [60, 5], // from 60 sec to 10 min the step is 5 sec
            '50%': [600, 60], // from 10 min to 30 min the step is 1 minute
            '75%': [1800, 300], // from 30 min to 60 min the step is 5 minute
            max: [3600], // max value is 1 hour
        }
    };

    private userConfig$: Observable<UserConfiguration>;
    private userConfigSubscription: Subscription;
    private backlightingOptionsSubscription: Subscription;

    constructor(private store: Store<AppState>,
                private cdRef: ChangeDetectorRef) {}

    ngOnInit() {
        this.userConfig$ = this.store.select(getUserConfiguration);
        this.userConfigSubscription = this.userConfig$.subscribe(config => {
            this.iconsAndLayerTextsBrightness = config.iconsAndLayerTextsBrightness;
            this.alphanumericSegmentsBrightness = config.alphanumericSegmentsBrightness;
            this.keyBacklightBrightness = config.keyBacklightBrightness;
            this.ledsFadeTimeout = config.ledsFadeTimeout;
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
    }

    ngOnDestroy() {
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
