import { CanActivate, Router } from '@angular/router';
import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AppState, getUpdateUdevRules } from '../store';

@Injectable({
    providedIn: 'root'
})
export class UhkUdevGuard implements CanActivate {
    private readonly router = inject(Router);
    private readonly store = inject<Store<AppState>>(Store);

    canActivate(): Observable<boolean> {
        return this.store.select(getUpdateUdevRules)
            .pipe(
                map(updateUdevRules => {
                    if (updateUdevRules) {
                        this.router.navigate(['/privilege']);
                    }

                    return !updateUdevRules;
                })
            );
    }
}
