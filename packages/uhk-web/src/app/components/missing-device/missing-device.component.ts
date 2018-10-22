import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/ignoreElements';
import 'rxjs/add/operator/takeWhile';

import { AppState, showUdevRules } from '../../store';

@Component({
    selector: 'missing-device',
    templateUrl: './missing-device.component.html'
})
export class MissingDeviceComponent {

    showUdevInfo$: Observable<boolean>;

    constructor(private store: Store<AppState>) {
        this.showUdevInfo$ = this.store.select(showUdevRules);
    }
}
