import { CanActivate, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { tap } from 'rxjs/operators';

import { AppState, bootloaderActive } from '../store';

@Injectable()
export class UhkDeviceBootloaderNotActiveGuard implements CanActivate {

    constructor(private store: Store<AppState>, private router: Router) { }

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
