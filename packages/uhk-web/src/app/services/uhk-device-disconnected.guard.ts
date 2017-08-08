import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';

import { AppState, deviceConnected } from '../store/index';
import { Store } from '@ngrx/store';

@Injectable()
export class UhkDeviceDisconnectedGuard implements CanActivate {

    constructor(private store: Store<AppState>, private router: Router) { }

    canActivate(): Observable<boolean> {
        return this.store.select(deviceConnected)
            .do(connected => {
                if (connected) {
                    this.router.navigate(['/privilege']);
                }
            })
            .map(connected => !connected);
    }
}
