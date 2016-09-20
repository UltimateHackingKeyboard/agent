import { Component, Renderer, animate, state, style, transition, trigger } from '@angular/core';

import { Keymap } from '../../config-serializer/config-items/Keymap';
import { Macro } from '../../config-serializer/config-items/Macro';

import { AppState } from '../../store';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

@Component({
    animations: [
        trigger('toggler', [
            state('inactive', style({
                height: '0px'
            })),
            state('active',   style({
                height: '*'
            })),
            transition('inactive <=> active', animate('500ms ease-out'))
        ])
    ],
    selector: 'side-menu',
    template: require('./side-menu.component.html'),
    styles: [require('./side-menu.component.scss')]
})
export class SideMenuComponent {
    private keymaps$: Observable<Keymap[]>;
    private macros$: Observable<Macro[]>;
    private animation: {[key: string]: 'active' | 'inactive'};

    constructor(private store: Store<AppState>, private renderer: Renderer) {
        this.animation = {
            keymap: 'active',
            macro: 'active',
            addon: 'active'
        };

        this.keymaps$ = store.select(appState => appState.keymaps);
        this.macros$ = store.select(appState => appState.macros);
    }

    toggleHide(event: Event, type: string) {
        let header: DOMTokenList = (<Element> event.target).classList;
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
}
