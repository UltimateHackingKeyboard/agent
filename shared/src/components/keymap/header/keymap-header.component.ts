import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    Input,
    OnChanges,
    Renderer,
    SimpleChanges,
    ViewChild
} from '@angular/core';

import { Store } from '@ngrx/store';

import { Keymap } from '../../../config-serializer/config-items/Keymap';

import { AppState } from '../../../store';
import { KeymapActions } from '../../../store/actions';

@Component({
    selector: 'keymap-header',
    template: require('./keymap-header.component.html'),
    styles: [require('./keymap-header.component.scss')],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class KeymapHeaderComponent implements OnChanges {
    @Input() keymap: Keymap;
    @Input() deletable: boolean;

    @ViewChild('name') keymapName: ElementRef;
    @ViewChild('abbr') keymapAbbr: ElementRef;

    private starTitle: string;
    private trashTitle: string;

    constructor(private store: Store<AppState>, private renderer: Renderer) { }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['keymap']) {
            this.setKeymapTitle();
        }
        if (changes['deletable']) {
            this.setTrashTitle();
        }
    }

    setDefault() {
        if (!this.keymap.isDefault) {
            this.store.dispatch(KeymapActions.setDefault(this.keymap.abbreviation));
        }
    }

    removeKeymap() {
        if (this.deletable) {
            this.store.dispatch(KeymapActions.removeKeymap(this.keymap.abbreviation));
        }
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

    setKeymapTitle(): void {
        this.starTitle = this.keymap.isDefault
            ? 'This is the default keymap which gets activated when powering the keyboard.'
            : 'Makes this keymap the default keymap which gets activated when powering the keyboard.';
    }

    setTrashTitle(): void {
        this.trashTitle = this.deletable ? '' : 'The last keymap cannot be deleted.';
    }
}
