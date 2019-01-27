import { CanActivate, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { map, tap } from 'rxjs/operators';

import { AppState, deviceConfigurationLoaded } from '../store';

@Injectable()
export class UhkDeviceLoadedGuard implements CanActivate {
    constructor(private store: Store<AppState>, private router: Router) {}

    canActivate(): Observable<boolean> {
        return this.store.select(deviceConfigurationLoaded).pipe(
            tap(loaded => {
                if (loaded) {
                    this.router.navigate(['/']);
                }
            }),
            map(loaded => !loaded),
        );
    }
}
