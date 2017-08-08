import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/ignoreElements';
import 'rxjs/add/operator/takeWhile';

import { LogService, NotificationType } from 'uhk-common';
import { AppState } from '../../store/index';
import { SetPrivilegeOnLinuxAction } from '../../store/actions/device';
import { ShowNotificationAction } from '../../store/actions/app';

@Component({
    selector: 'privilege-checker',
    templateUrl: './privilege-checker.component.html',
    styleUrls: ['./privilege-checker.component.scss']
})
export class PrivilegeCheckerComponent {

    constructor(private router: Router,
                private logService: LogService,
                protected store: Store<AppState>) {
    }

    setUpPermissions(): void {
        switch (process.platform) {
            case 'linux':
                this.store.dispatch(new SetPrivilegeOnLinuxAction());
                break;
            default:
                this.store.dispatch(new ShowNotificationAction({
                    type: NotificationType.Error,
                    message: 'Permissions couldn\'t be set. Invalid platform: ' + process.platform
                }));
                break;
        }
    }
}
