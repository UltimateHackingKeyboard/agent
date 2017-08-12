import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/ignoreElements';
import 'rxjs/add/operator/takeWhile';

import { AppState } from '../../store/index';
import { SetPrivilegeOnLinuxAction } from '../../store/actions/device';

@Component({
    selector: 'privilege-checker',
    templateUrl: './privilege-checker.component.html',
    styleUrls: ['./privilege-checker.component.scss']
})
export class PrivilegeCheckerComponent {

    constructor(protected store: Store<AppState>) {
    }

    setUpPermissions(): void {
        this.store.dispatch(new SetPrivilegeOnLinuxAction());
    }
}
