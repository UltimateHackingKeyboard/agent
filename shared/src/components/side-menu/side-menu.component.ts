import { Component, Renderer, animate, state, style, transition, trigger } from '@angular/core';

import { Store } from '@ngrx/store';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/let';

import { Keymap } from '../../config-serializer/config-items/Keymap';
import { Macro } from '../../config-serializer/config-items/Macro';

import { AppState } from '../../store';
import { MacroActions } from '../../store/actions';
import { getKeymaps, getMacros } from '../../store/reducers/user-configuration';

@Component({
    animations: [
        trigger('toggler', [
            state('inactive', style({
                height: '0px'
            })),
            state('active', style({
                height: '*'
            })),
            transition('inactive <=> active', animate('500ms ease-out'))
        ])
    ],
    selector: 'side-menu',
    templateUrl: './side-menu.component.html',
    styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent {
    private keymaps$: Observable<Keymap[]>;
    private macros$: Observable<Macro[]>;
    private animation: { [key: string]: 'active' | 'inactive' };

    constructor(private store: Store<AppState>, private renderer: Renderer) {
        this.animation = {
            keymap: 'active',
            macro: 'active',
            addon: 'active'
        };

        this.keymaps$ = store.let(getKeymaps())
            .map(keymaps => keymaps.slice()) // Creating a new array reference, because the sort is working in place
            .do((keymaps: Keymap[]) => {
                keymaps.sort((first: Keymap, second: Keymap) => first.name.localeCompare(second.name));
            });

        this.macros$ = store.let(getMacros())
            .map(macros => macros.slice()) // Creating a new array reference, because the sort is working in place
            .do((macros: Macro[]) => {
                macros.sort((first: Macro, second: Macro) => first.name.localeCompare(second.name));
            });
    }

    toggleHide(event: Event, type: string) {
        let header: DOMTokenList = (<Element>event.target).classList;
        let show = false;

        if (header.contains('fa-chevron-down')) {
            show = true;
            this.animation[type] = 'active';
        } else {
            this.animation[type] = 'inactive';
        }

        this.renderer.setElementClass(event.target, 'fa-chevron-up', show);
        this.renderer.setElementClass(event.target, 'fa-chevron-down', !show);
    }

    addMacro() {
        this.store.dispatch(MacroActions.addMacro());
    }
}
