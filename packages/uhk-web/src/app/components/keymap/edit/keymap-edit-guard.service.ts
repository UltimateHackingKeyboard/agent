import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Keymap } from 'uhk-common';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { switchMap, tap } from 'rxjs/operators';

import 'rxjs/add/operator/let';

import { Store } from '@ngrx/store';

import { AppState } from '../../../store';
import { getKeymaps } from '../../../store/reducers/user-configuration';

@Injectable()
export class KeymapEditGuard implements CanActivate {
    constructor(private store: Store<AppState>, private router: Router) {}

    canActivate(): Observable<boolean> {
        return this.store.let(getKeymaps()).pipe(
            tap((keymaps: Keymap[]) => {
                const defaultKeymap = keymaps.find(keymap => keymap.isDefault);
                if (defaultKeymap) {
                    this.router.navigate(['/keymap', defaultKeymap.abbreviation]);
                }
            }),
            switchMap(() => of(false)),
        );
    }
}
