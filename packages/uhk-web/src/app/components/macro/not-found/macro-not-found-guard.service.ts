import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Macro } from 'uhk-common';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Store } from '@ngrx/store';

import { AppState, getMacros } from '../../../store';

@Injectable()
export class MacroNotFoundGuard implements CanActivate {
    private readonly store = inject<Store<AppState>>(Store);
    private readonly router = inject(Router);

    canActivate(): Observable<boolean> {
        return this.store
            .select(getMacros)
            .pipe(
                map((macros: Macro[]) => {
                    const hasMacros = macros.length > 0;
                    if (hasMacros) {
                        this.router.navigate(['/macro', macros[0].id]);
                    }
                    return !hasMacros;
                })
            );
    }
}
