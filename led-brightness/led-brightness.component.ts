import { Component } from '@angular/core';

import { Store } from '@ngrx/store';
import { AppState } from '../../../store/index';

@Component({
    selector: 'device-led-brightness',
    templateUrl: './led-brightness.component.html',
    styleUrls: ['./led-brightness.component.scss'],
    host: {
        'class': 'container-fluid'
    }
})
export class LEDBrightnessComponent {
    public iconsAndLayerTextsBrightness: number = 0;
    public alphanumericSegmentsBrightness: number = 0;
    public keyBacklightBrightness: number = 0;

    constructor(private store: Store<AppState>) {}
}
