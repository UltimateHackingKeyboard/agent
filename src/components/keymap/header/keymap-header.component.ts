import { Component, ElementRef, Input, Renderer, ViewChild } from '@angular/core';

import { Store } from '@ngrx/store';

import { Keymap } from '../../../config-serializer/config-items/Keymap';

import { AppState } from '../../../store';
import { KeymapActions } from '../../../store/actions';

@Component({
    selector: 'keymap-header',
    template: require('./keymap-header.component.html'),
    styles: [require('./keymap-header.component.scss')]
})
export class KeymapHeaderComponent {
    @Input() keymap: Keymap;
    @ViewChild('name') keymapName: ElementRef;
    @ViewChild('abbr') keymapAbbr: ElementRef;

    constructor(private store: Store<AppState>, private renderer: Renderer) { }

    setDefault() {
        if (!this.keymap.isDefault) {
            this.store.dispatch(KeymapActions.setDefault(this.keymap.abbreviation));
        }
    }

    removeKeymap() {
        this.store.dispatch(KeymapActions.removeKeymap(this.keymap.abbreviation));
    }

    duplicateKeymap() {
        this.store.dispatch(KeymapActions.duplicateKeymap(this.keymap));
    }

    editKeymapName(name: string) {
        if (name.length === 0) {
            this.renderer.setElementProperty(this.keymapName.nativeElement, 'value', this.keymap.name);
            return;
        }

        this.store.dispatch(KeymapActions.editKeymapName(this.keymap.abbreviation, name));
    }

    editKeymapAbbr(newAbbr: string) {
        if (newAbbr.length !== 3) {
            this.renderer.setElementProperty(this.keymapAbbr.nativeElement, 'value', this.keymap.abbreviation);
            return;
        }

        newAbbr = newAbbr.toUpperCase();
        this.store.dispatch(KeymapActions.editKeymapAbbr(this.keymap.abbreviation, newAbbr));
    }
}
