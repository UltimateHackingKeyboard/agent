import { Directive, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ColorPickerDirective } from 'ngx-color-picker';
import { Subscription } from 'rxjs';

import { AppState, isColorPickerEyeDropperEnabled } from '../store/index';

@Directive({
    selector: '[cpEyeDropper]',
    standalone: true,
})
export class NgxColorPickerEyeDropper implements OnDestroy, OnInit {
    private subscription: Subscription;

    constructor(private store: Store<AppState>,
                private colorPicker: ColorPickerDirective) {
    }

    ngOnInit() {
        this.subscription = this.store.select(isColorPickerEyeDropperEnabled)
            .subscribe(value => {
                this.colorPicker.cpEyeDropper = value;
            })
    }

    ngOnDestroy() {
        this.subscription?.unsubscribe();
    }
}
