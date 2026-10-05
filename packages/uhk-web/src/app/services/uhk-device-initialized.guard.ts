import { CanActivate, Router } from '@angular/router';
import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { AppState, hasDevicePermission } from '../store/index';

@Injectable()
export class UhkDeviceInitializedGuard implements CanActivate {
    private readonly router = inject(Router);
    private readonly store = inject<Store<AppState>>(Store);

    canActivate(): Observable<boolean> {
        return this.store.select(hasDevicePermission)
            .pipe(
                tap(hasPermission => {
                    if (hasPermission) {
                        this.router.navigate(['/detection']);
                    }
                }),
                map(hasPermission => !hasPermission)
            );
    }
}
