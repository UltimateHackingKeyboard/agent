import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    EventEmitter,
    HostListener,
    Input,
    OnChanges,
    Output,
    Renderer2,
    SimpleChanges,
    ViewChild
} from '@angular/core';
import { Keymap } from 'uhk-common';

import { Store } from '@ngrx/store';

import { AppState } from '../../../store';
import {
    DuplicateKeymapAction,
    EditKeymapAbbreviationAction,
    EditKeymapNameAction,
    RemoveKeymapAction,
    SetDefaultKeymapAction
} from '../../../store/actions/keymap';
import * as util from '../../../util';

const DEFAULT_TRASH_TITLE = '<span class="text-nowrap">Delete keymap</span>';

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

    @ViewChild('name', { static: true }) keymapName: ElementRef;
    @ViewChild('abbr', { static: true }) keymapAbbr: ElementRef;

    starTitle: string;
    trashTitle: string = DEFAULT_TRASH_TITLE;

    constructor(private store: Store<AppState>, private renderer: Renderer2) { }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['keymap']) {
            this.setKeymapTitle();
            this.setName();
            this.setAbbreviation();
        }
        if (changes['deletable']) {
            this.setTrashTitle();
        }
    }

    @HostListener('window:resize')
    windowResize(): void {
        this.calculateHeaderTextWidth(this.keymap.name);
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
            this.setName();
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
        this.starTitle = this.keymap.isDefault
            ? 'This is the default keymap which gets activated when powering the keyboard.'
            : 'Makes this keymap the default keymap which gets activated when powering the keyboard.';
    }

    setTrashTitle(): void {
        this.trashTitle = this.deletable
            ? DEFAULT_TRASH_TITLE
            : '<span class="text-nowrap">The last keymap cannot be deleted.</span>';
    }

    onDownloadIconClick(): void {
        this.downloadClick.emit();
    }

    calculateHeaderTextWidth(text): void {
        const htmlInput = this.keymapName.nativeElement as HTMLInputElement;
        const maxWidth = htmlInput.parentElement.offsetWidth - 530;
        const textWidth = util.getContentWidth(window.getComputedStyle(htmlInput), text);
        this.renderer.setStyle(htmlInput, 'width', Math.min(maxWidth, textWidth) + 'px');
    }

    private setName(): void {
        this.renderer.setProperty(this.keymapName.nativeElement, 'value', this.keymap.name);
        this.calculateHeaderTextWidth(this.keymap.name);
    }

    private setAbbreviation() {
        this.renderer.setProperty(this.keymapAbbr.nativeElement, 'value', this.keymap.abbreviation);
    }
}
