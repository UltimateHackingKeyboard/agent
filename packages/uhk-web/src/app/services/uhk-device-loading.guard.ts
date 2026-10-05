import { CanActivate, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Injectable, inject } from '@angular/core';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { AppState, deviceConfigurationLoaded } from '../store';

@Injectable()
export class UhkDeviceLoadingGuard implements CanActivate {
    private readonly router = inject(Router);
    private readonly store = inject<Store<AppState>>(Store);

    canActivate(): Observable<boolean> {
        return this.store.select(deviceConfigurationLoaded)
            .pipe(
                tap(loaded => {
                    if (!loaded) {
                        this.router.navigate(['/loading']);
                    }
                })
            );
    }
}
