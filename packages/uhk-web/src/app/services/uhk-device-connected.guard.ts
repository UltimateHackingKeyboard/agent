import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';

import { AppState, deviceConnected } from '../store/index';

@Injectable()
export class UhkDeviceConnectedGuard implements CanActivate {

    constructor(private store: Store<AppState>, private router: Router) { }

    canActivate(): Observable<boolean> {
        return this.store.select(deviceConnected)
            .do(connected => {
                if (connected) {
                    this.router.navigate(['/']);
                }
            })
            .map(connected => !connected);
    }
}
