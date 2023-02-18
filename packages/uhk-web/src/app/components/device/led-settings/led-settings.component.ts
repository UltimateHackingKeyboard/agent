import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState, getUserConfiguration } from '../../../store';
import {
    SetUserConfigurationRgbValueAction,
    SetUserConfigurationValueAction
} from '../../../store/actions/user-config';
import { SliderPips } from '../../slider-wrapper/slider-wrapper.component';
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
    backlightingModeEnum = BacklightingMode;
    backlightingMode = BacklightingMode.FunctionalBacklighting;
    backlightingNoneActionColor: RgbColorInterface;
    backlightingScancodeColor: RgbColorInterface;
    backlightingModifierColor: RgbColorInterface;
    backlightingShortcutColor: RgbColorInterface;
    backlightingSwitchLayerColor: RgbColorInterface;
    backlightingSwitchKeymapColor: RgbColorInterface;
    backlightingMouseColor: RgbColorInterface;
    backlightingMacroColor: RgbColorInterface;

    public iconsAndLayerTextsBrightness: number = 0;
    public alphanumericSegmentsBrightness: number = 0;
    public keyBacklightBrightness: number = 0;
    public sliderPips: SliderPips = {
        mode: 'positions',
        values: [0, 50, 100],
        density: 6,
        stepped: true
    };
    faSlidersH = faSlidersH;

    private userConfig$: Observable<UserConfiguration>;
    private userConfigSubscription: Subscription;

    constructor(private store: Store<AppState>) {}

    ngOnInit() {
        this.userConfig$ = this.store.select(getUserConfiguration);
        this.userConfigSubscription = this.userConfig$.subscribe(config => {
            this.iconsAndLayerTextsBrightness = config.iconsAndLayerTextsBrightness;
            this.alphanumericSegmentsBrightness = config.alphanumericSegmentsBrightness;
            this.keyBacklightBrightness = config.keyBacklightBrightness;
            this.backlightingMode = config.backlightingMode;
            this.backlightingNoneActionColor = config.backlightingNoneActionColor.toJsonObject();
            this.backlightingScancodeColor = config.backlightingScancodeColor.toJsonObject();
            this.backlightingModifierColor = config.backlightingModifierColor.toJsonObject();
            this.backlightingShortcutColor = config.backlightingShortcutColor.toJsonObject();
            this.backlightingSwitchLayerColor = config.backlightingSwitchLayerColor.toJsonObject();
            this.backlightingSwitchKeymapColor = config.backlightingSwitchKeymapColor.toJsonObject();
            this.backlightingMouseColor = config.backlightingMouseColor.toJsonObject();
            this.backlightingMacroColor = config.backlightingMacroColor.toJsonObject();
        });
    }

    ngOnDestroy() {
        this.userConfigSubscription.unsubscribe();
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
