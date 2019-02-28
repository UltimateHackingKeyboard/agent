import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { AppState, getMissingDeviceState } from '../../store';
import { MissingDeviceState } from '../../models/missing-device-state';

@Component({
    selector: 'missing-device',
    templateUrl: './missing-device.component.html'
})
export class MissingDeviceComponent implements OnDestroy {

    state: MissingDeviceState;

    private stateSubscription: Subscription;

    constructor(private store: Store<AppState>) {
        this.stateSubscription = this.store
            .select(getMissingDeviceState)
            .subscribe(state => this.state = state);
    }

    ngOnDestroy(): void {
        this.stateSubscription.unsubscribe();
    }
}
