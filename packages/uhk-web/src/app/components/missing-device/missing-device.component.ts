import { Component, OnDestroy, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { AppState, getMissingDeviceState } from '../../store';
import { MissingDeviceState } from '../../models/missing-device-state';

@Component({
    selector: 'missing-device',
    standalone: false,
    templateUrl: './missing-device.component.html'
})
export class MissingDeviceComponent implements OnDestroy {

    state: MissingDeviceState;

    private stateSubscription: Subscription;
    private readonly store = inject<Store<AppState>>(Store);

    constructor() {
        this.stateSubscription = this.store
            .select(getMissingDeviceState)
            .subscribe(state => this.state = state);
    }

    ngOnDestroy(): void {
        this.stateSubscription.unsubscribe();
    }
}
