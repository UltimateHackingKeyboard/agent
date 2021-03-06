import { CanActivate, Router, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AppState, calculateDeviceUiState } from '../store';
import { DeviceUiStates } from '../models';

@Injectable()
export class UhkMultiDeviceGuard implements CanActivate {

    constructor(private store: Store<AppState>, private router: Router) { }

    canActivate(): Observable<boolean | UrlTree> {
        return this.store.select(calculateDeviceUiState)
            .pipe(
                map(uiState => {
                    if (uiState === DeviceUiStates.MultiDevice) {
                        return this.router.parseUrl('/multi-device');
                    }

                    return true;
                })
            );
    }
}
