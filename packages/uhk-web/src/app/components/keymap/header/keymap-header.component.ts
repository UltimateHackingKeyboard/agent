import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    Input,
    OnChanges,
    OnDestroy,
    Renderer2,
    SimpleChanges,
    ViewChild
} from '@angular/core';
import { Keymap } from 'uhk-common';
import { Subscription } from 'rxjs';

import { Store } from '@ngrx/store';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { faCopy, faKeyboard, faStar as faSolidStar, faTrash } from '@fortawesome/free-solid-svg-icons';
import { faStar as faRegularStar } from '@fortawesome/free-regular-svg-icons';

import { AppState, extraLEDCharactersSupported } from '../../../store';
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
export class KeymapHeaderComponent implements OnChanges, OnDestroy {

    @Input() keymap: Keymap;
    @Input() deletable: boolean;

    @ViewChild('abbr', { static: true }) keymapAbbr: ElementRef;

    starTitle: string;
    starIcon: IconDefinition;
    trashTitle: string = DEFAULT_TRASH_TITLE;
    faKeyboard = faKeyboard;
    faCopy = faCopy;
    faTrash = faTrash;

    private subscriptions = new Subscription();
    private extraLEDCharactersSupported = false;

    constructor(private store: Store<AppState>, private renderer: Renderer2) {
        this.subscriptions.add(
            this.store
                .select(extraLEDCharactersSupported)
                .subscribe(value => this.extraLEDCharactersSupported = value)
        );
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['keymap']) {
            this.setKeymapTitle();
            this.setAbbreviation();
        }
        if (changes['deletable']) {
            this.setTrashTitle();
        }
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
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
        const regexp = this.extraLEDCharactersSupported
            ? new RegExp(/^[a-zA-Z\d$+\-*/|\\<>?_'",`@={} ]{1,3}$/g)
            : new RegExp(/^[a-zA-Z\d]{1,3}$/g);

        if (newAbbr.trim().length === 0 || !regexp.test(newAbbr)) {
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
