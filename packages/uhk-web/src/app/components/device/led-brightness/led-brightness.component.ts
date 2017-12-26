import { AfterViewInit, Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState, getUserConfiguration } from '../../../store';
import { SetUserConfigurationValueAction } from '../../../store/actions/user-config';
import { SliderPips } from '../../slider-wrapper/slider-wrapper.component';

@Component({
    selector: 'device-led-brightness',
    templateUrl: './led-brightness.component.html',
    styleUrls: ['./led-brightness.component.scss'],
    host: {
        'class': 'container-fluid'
    }
})
export class LEDBrightnessComponent implements OnInit {
    public iconsAndLayerTextsBrightness: number = 0;
    public alphanumericSegmentsBrightness: number = 0;
    public keyBacklightBrightness: number = 0;
    public sliderPips: SliderPips = {
        mode: 'positions',
        values: [0, 50, 128, 255],
        density: 6,
        stepped: true
    };

    constructor(private store: Store<AppState>) {}

    ngOnInit() {
        this.store.select(getUserConfiguration)
            .subscribe(config => {
                this.iconsAndLayerTextsBrightness = config.iconsAndLayerTextsBrightness;
                this.alphanumericSegmentsBrightness = config.alphanumericSegmentsBrightness;
                this.keyBacklightBrightness = config.keyBacklightBrightness;
            }).unsubscribe();
    }

    onSetPropertyValue(propertyName: string, value: number): void {
        this.store.dispatch(new SetUserConfigurationValueAction({
            propertyName,
            value
        }));
    }
}
