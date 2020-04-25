import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState, getUserConfiguration } from '../../../store';
import { SetUserConfigurationValueAction } from '../../../store/actions/user-config';
import { SliderPips } from '../../slider-wrapper/slider-wrapper.component';
import { Observable, Subscription } from 'rxjs';
import { faSlidersH } from '@fortawesome/free-solid-svg-icons';
import { UserConfiguration } from 'uhk-common';

@Component({
    selector: 'device-led-brightness',
    templateUrl: './led-brightness.component.html',
    styleUrls: ['./led-brightness.component.scss'],
    host: {
        'class': 'container-fluid'
    }
})
export class LEDBrightnessComponent implements OnInit, OnDestroy {
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
