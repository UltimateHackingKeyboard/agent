import { CanActivate, Router } from '@angular/router';
import { Injectable, inject } from '@angular/core';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { AppState, deviceConnected } from '../store';
import { Store } from '@ngrx/store';

@Injectable()
export class UhkDeviceDisconnectedGuard implements CanActivate {
    private readonly router = inject(Router);
    private readonly store = inject<Store<AppState>>(Store);

    canActivate(): Observable<boolean> {
        return this.store.select(deviceConnected)
            .pipe(
                tap(connected => {
                    if (!connected) {
                        this.router.navigate(['/detection']);
                    }
                })
            );
    }
}
