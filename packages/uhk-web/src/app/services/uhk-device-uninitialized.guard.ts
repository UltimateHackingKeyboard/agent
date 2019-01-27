import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { tap } from 'rxjs/operators';

import { AppState, hasDevicePermission } from '../store';

@Injectable()
export class UhkDeviceUninitializedGuard implements CanActivate {
    constructor(private store: Store<AppState>, private router: Router) {}

    canActivate(): Observable<boolean> {
        return this.store.select(hasDevicePermission).pipe(
            tap(hasPermission => {
                if (!hasPermission) {
                    this.router.navigate(['/privilege']);
                }
            }),
        );
    }
}
