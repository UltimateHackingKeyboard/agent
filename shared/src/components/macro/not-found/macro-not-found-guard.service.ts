import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/let';
import 'rxjs/add/operator/map';

import { Store } from '@ngrx/store';

import { AppState } from '../../../store/index';
import { getMacroEntities } from '../../../store/reducers';

@Injectable()
export class MacroNotFoundGuard implements CanActivate {

    constructor(private store: Store<AppState>, private router: Router) { }

    canActivate(): Observable<boolean> {
        return this.store
            .let(getMacroEntities())
            .map(macros => {
                const hasMacros = macros.length > 0;
                if (hasMacros) {
                    this.router.navigate(['/macro', macros[0].id]);
                }
                return !hasMacros;
            });
    }
}
