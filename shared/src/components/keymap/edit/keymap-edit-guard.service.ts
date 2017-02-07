import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/let';
import 'rxjs/add/operator/switchMap';

import { Store } from '@ngrx/store';

import { Keymap } from './../../../config-serializer/config-items/Keymap';
import { AppState } from '../../../store/index';
import { getKeymaps } from '../../../store/reducers/user-configuration';

@Injectable()
export class KeymapEditGuard implements CanActivate {

    constructor(private store: Store<AppState>, private router: Router) { }

    canActivate(): Observable<boolean> {
        return this.store
            .let(getKeymaps())
            .do((keymaps: Keymap[]) => {
                const defaultKeymap = keymaps.find(keymap => keymap.isDefault);
                this.router.navigate(['/keymap', defaultKeymap.abbreviation]);
            })
            .switchMap(() => Observable.of(false));
    }
}
