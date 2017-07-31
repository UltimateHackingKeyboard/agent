import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/let';
import 'rxjs/add/operator/map';

import { Store } from '@ngrx/store';

import { AppState } from '../../../store/index';
import { getMacros } from '../../../store/reducers/user-configuration';
import { Macro } from './../../../config-serializer/config-items/macro';

@Injectable()
export class MacroNotFoundGuard implements CanActivate {

    constructor(private store: Store<AppState>, private router: Router) { }

    canActivate(): Observable<boolean> {
        return this.store
            .let(getMacros())
            .map((macros: Macro[]) => {
                const hasMacros = macros.length > 0;
                if (hasMacros) {
                    this.router.navigate(['/macro', macros[0].id]);
                }
                return !hasMacros;
            });
    }
}
