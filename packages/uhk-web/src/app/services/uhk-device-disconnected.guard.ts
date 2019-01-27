import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { tap } from 'rxjs/operators';

import { AppState, deviceConnected } from '../store';
import { Store } from '@ngrx/store';

@Injectable()
export class UhkDeviceDisconnectedGuard implements CanActivate {
    constructor(private store: Store<AppState>, private router: Router) {}

    canActivate(): Observable<boolean> {
        return this.store.select(deviceConnected).pipe(
            tap(connected => {
                if (!connected) {
                    this.router.navigate(['/detection']);
                }
            }),
        );
    }
}
