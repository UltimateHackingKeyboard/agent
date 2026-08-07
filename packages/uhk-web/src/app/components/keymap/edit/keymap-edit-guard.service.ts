import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Keymap, LayerName } from 'uhk-common';

import { Observable, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

import { Store } from '@ngrx/store';

import { AppState, getDefaultKeymap } from '../../../store';

@Injectable()
export class KeymapEditGuard implements CanActivate {
    private readonly store = inject<Store<AppState>>(Store);
    private readonly router = inject(Router);

    canActivate(): Observable<boolean> {
        return this.store
            .select(getDefaultKeymap)
            .pipe(
                tap((defaultKeymap: Keymap) => {
                    if (defaultKeymap) {
                        this.router.navigate(['/keymap', defaultKeymap.abbreviation], { queryParams: { layer: LayerName.base } });
                    }
                }),
                switchMap(() => of(false))
            );
    }
}
