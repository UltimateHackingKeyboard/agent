import { Directive, OnDestroy, OnInit, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { ColorPickerDirective } from 'ngx-color-picker';
import { Subscription } from 'rxjs';

import { AppState, isColorPickerEyeDropperEnabled } from '../store/index';

@Directive({
    selector: '[cpEyeDropper]',
    standalone: true,
})
export class NgxColorPickerEyeDropper implements OnDestroy, OnInit {
    private readonly colorPicker = inject(ColorPickerDirective);
    private readonly store = inject<Store<AppState>>(Store);
    private subscription: Subscription;

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
