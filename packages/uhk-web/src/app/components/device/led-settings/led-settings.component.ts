import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState, getUserConfiguration } from '../../../store';
import { SetUserConfigurationValueAction } from '../../../store/actions/user-config';
import { SliderPips } from '../../slider-wrapper/slider-wrapper.component';
import { Observable, Subscription } from 'rxjs';
import { faSlidersH } from '@fortawesome/free-solid-svg-icons';
import { BacklightingMode, UserConfiguration } from 'uhk-common';

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
}
