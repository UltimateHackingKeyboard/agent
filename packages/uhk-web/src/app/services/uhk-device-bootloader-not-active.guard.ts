import { CanActivate, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Injectable, inject } from '@angular/core';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { AppState, bootloaderActive } from '../store';

@Injectable()
export class UhkDeviceBootloaderNotActiveGuard implements CanActivate {
    private readonly router = inject(Router);
    private readonly store = inject<Store<AppState>>(Store);

    canActivate(): Observable<boolean> {
        return this.store.select(bootloaderActive)
            .pipe(
                tap(active => {
                    if (!active) {
                        this.router.navigate(['/']);
                    }
                })
            );
    }
}
