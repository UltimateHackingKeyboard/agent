import { AfterViewInit, Component, OnInit, ViewChildren, QueryList } from '@angular/core';

import { Store } from '@ngrx/store';
import { AppState, getUserConfiguration } from '../../../store';
import { NouisliderComponent } from 'ng2-nouislider/src/nouislider';

const sliderPips = {
    mode: 'positions',
    values: [0, 50, 128, 255],
    density: 6,
    stepped: true
};

@Component({
    selector: 'device-led-brightness',
    templateUrl: './led-brightness.component.html',
    styleUrls: ['./led-brightness.component.scss'],
    host: {
        'class': 'container-fluid'
    }
})
export class LEDBrightnessComponent implements OnInit, AfterViewInit {
    @ViewChildren(NouisliderComponent) sliders: QueryList<NouisliderComponent>;

    public iconsAndLayerTextsBrightness: number = 0;
    public alphanumericSegmentsBrightness: number = 0;
    public keyBacklightBrightness: number = 0;
    public sliderTooltipsEnabled: boolean = false;

    constructor(private store: Store<AppState>) {}

    ngOnInit() {
        this.store.select(getUserConfiguration)
            .subscribe(config => {
                this.iconsAndLayerTextsBrightness = config.iconsAndLayerTextsBrightness;
                this.alphanumericSegmentsBrightness = config.alphanumericSegmentsBrightness;
                this.keyBacklightBrightness = config.keyBacklightBrightness;
            });
    }

    ngAfterViewInit() {
        this.sliders.forEach(slider => {
            slider.slider.pips(sliderPips);
            slider.slider.target.querySelector('.noUi-tooltip').style.display = 'none';

            slider.slider.on('start', function() {
                this.target.querySelector('.noUi-tooltip').style.display = 'block';
            });
            slider.slider.on('end', function() {
                this.target.querySelector('.noUi-tooltip').style.display = 'none';
            });
        });
    }
}
