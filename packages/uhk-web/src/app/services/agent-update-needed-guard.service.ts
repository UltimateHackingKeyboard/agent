import { CanActivate, Router, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { Injectable, inject } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AppState, calculateDeviceUiState } from '../store';
import { DeviceUiStates } from '../models';

@Injectable()
export class AgentUpdateNeededGuard implements CanActivate {
    private readonly router = inject(Router);
    private readonly store = inject<Store<AppState>>(Store);

    canActivate(): Observable<boolean | UrlTree> {
        return this.store.select(calculateDeviceUiState)
            .pipe(
                map(uiState => {
                    if (uiState === DeviceUiStates.UpdateNeeded) {
                        return this.router.parseUrl('/update-agent');
                    }

                    return true;
                })
            );
    }
}
