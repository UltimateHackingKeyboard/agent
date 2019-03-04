import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { AppState, deviceConnected } from '../store/index';

@Injectable()
export class UhkDeviceConnectedGuard implements CanActivate {

    constructor(private store: Store<AppState>, private router: Router) { }

    canActivate(): Observable<boolean> {
        return this.store.select(deviceConnected)
            .pipe(
                tap(connected => {
                    if (connected) {
                        this.router.navigate(['/']);
                    }
                }),
                map(connected => !connected)
            );
    }
}
