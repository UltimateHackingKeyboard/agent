import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Macro } from 'uhk-common';

import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import 'rxjs/add/operator/let';

import { Store } from '@ngrx/store';

import { AppState } from '../../../store/index';
import { getMacros } from '../../../store/reducers/user-configuration';

@Injectable()
export class MacroNotFoundGuard implements CanActivate {
    constructor(private store: Store<AppState>, private router: Router) {}

    canActivate(): Observable<boolean> {
        return this.store.let(getMacros()).pipe(
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
