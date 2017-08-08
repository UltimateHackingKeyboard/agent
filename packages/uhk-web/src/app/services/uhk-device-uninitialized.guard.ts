import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';

import { AppState, deviceConnected } from '../store/index';

@Injectable()
export class UhkDeviceUninitializedGuard implements CanActivate {

    constructor(private store: Store<AppState>, private router: Router) { }

    canActivate(): Observable<boolean> {
        return this.store.select(deviceConnected)
            .do(initialized => {
                if (initialized) {
                    this.router.navigate(['/']);
                }
            })
            .map(initialized => !initialized);
    }
}
