import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Keymap } from 'uhk-common';

import { Observable, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

import { Store } from '@ngrx/store';

import { AppState, getDefaultKeymap } from '../../../store';

@Injectable()
export class KeymapEditGuard implements CanActivate {

    constructor(private store: Store<AppState>, private router: Router) { }

    canActivate(): Observable<boolean> {
        return this.store
            .select(getDefaultKeymap)
            .pipe(
                tap((defaultKeymap: Keymap) => {
                    if (defaultKeymap) {
                        this.router.navigate(['/keymap', defaultKeymap.abbreviation]);
                    }
                }),
                switchMap(() => of(false))
            );
    }
}
