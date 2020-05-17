import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    Renderer2,
    SimpleChanges,
    ViewChild
} from '@angular/core';
import { Keymap } from 'uhk-common';

import { Store } from '@ngrx/store';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { faCopy, faKeyboard, faStar as faSolidStar, faTrash } from '@fortawesome/free-solid-svg-icons';
import { faStar as faRegularStar } from '@fortawesome/free-regular-svg-icons';

import { AppState } from '../../../store';
import {
    DuplicateKeymapAction,
    EditKeymapAbbreviationAction,
    EditKeymapNameAction,
    RemoveKeymapAction,
    SetDefaultKeymapAction
} from '../../../store/actions/keymap';
import * as util from '../../../util';

const DEFAULT_TRASH_TITLE = 'Delete keymap';

@Component({
    selector: 'keymap-header',
    templateUrl: './keymap-header.component.html',
    styleUrls: ['./keymap-header.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class KeymapHeaderComponent implements OnChanges {

    @Input() keymap: Keymap;
    @Input() deletable: boolean;
    @Output() downloadClick = new EventEmitter<void>();

    @ViewChild('abbr', { static: true }) keymapAbbr: ElementRef;

    starTitle: string;
    starIcon: IconDefinition;
    trashTitle: string = DEFAULT_TRASH_TITLE;
    faKeyboard = faKeyboard;
    faCopy = faCopy;
    faTrash = faTrash;

    constructor(private store: Store<AppState>, private renderer: Renderer2) { }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['keymap']) {
            this.setKeymapTitle();
            this.setAbbreviation();
        }
        if (changes['deletable']) {
            this.setTrashTitle();
        }
    }

    setDefault() {
        if (!this.keymap.isDefault) {
            this.store.dispatch(new SetDefaultKeymapAction(this.keymap.abbreviation));
        }
    }

    removeKeymap() {
        if (this.deletable) {
            this.store.dispatch(new RemoveKeymapAction(this.keymap.abbreviation));
        }
    }

    duplicateKeymap() {
        this.store.dispatch(new DuplicateKeymapAction(this.keymap));
    }

    editKeymapName(name: string) {
        if (!util.isValidName(name)) {
            return;
        }

        this.store.dispatch(new EditKeymapNameAction({ abbr: this.keymap.abbreviation, name }));
    }

    editKeymapAbbr(newAbbr: string) {
        const regexp = new RegExp(/^[a-zA-Z\d]+$/g);

        if (newAbbr.length < 1 || newAbbr.length > 3 || !regexp.test(newAbbr)) {
            this.setAbbreviation();
            return;
        }

        newAbbr = newAbbr.toUpperCase();
        this.store.dispatch(new EditKeymapAbbreviationAction({
            name: this.keymap.name,
            abbr: this.keymap.abbreviation,
            newAbbr
        }));
    }

    setKeymapTitle(): void {
        if (this.keymap.isDefault) {
            this.starTitle = 'This is the default keymap which gets activated when powering the keyboard.';
            this.starIcon = faSolidStar;
        } else {
            this.starTitle = 'Makes this keymap the default keymap which gets activated when powering the keyboard.';
            this.starIcon = faRegularStar;
        }
    }

    setTrashTitle(): void {
        this.trashTitle = this.deletable
            ? DEFAULT_TRASH_TITLE
            : 'The last keymap cannot be deleted.';
    }

    private setAbbreviation() {
        this.renderer.setProperty(this.keymapAbbr.nativeElement, 'value', this.keymap.abbreviation);
    }
}
