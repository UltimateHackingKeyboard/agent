import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';

import { AppState, hasDevicePermission } from '../store/index';

@Injectable()
export class UhkDeviceInitializedGuard implements CanActivate {

    constructor(private store: Store<AppState>, private router: Router) { }

    canActivate(): Observable<boolean> {
        return this.store.select(hasDevicePermission)
            .do(hasPermission => {
                if (hasPermission) {
                    this.router.navigate(['/detection']);
                }
            })
            .map(hasPermission => !hasPermission);
    }
}
