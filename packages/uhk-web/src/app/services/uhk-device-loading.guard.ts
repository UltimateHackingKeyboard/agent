import { CanActivate, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';

import { AppState, deviceConfigurationLoaded } from '../store';

@Injectable()
export class UhkDeviceLoadingGuard implements CanActivate {

    constructor(private store: Store<AppState>, private router: Router) { }

    canActivate(): Observable<boolean> {
        return this.store.select(deviceConfigurationLoaded)
            .do(loaded => {
                if (!loaded) {
                    this.router.navigate(['/loading']);
                }
            });
    }
}
