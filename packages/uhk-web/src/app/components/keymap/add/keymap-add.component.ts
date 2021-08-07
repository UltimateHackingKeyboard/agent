import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { faKeyboard, faSearch } from '@fortawesome/free-solid-svg-icons';
import { HalvesInfo, Keymap } from 'uhk-common';

import { BehaviorSubject, Observable } from 'rxjs';
import { combineLatest, publishReplay, refCount } from 'rxjs/operators';

import { AppState, getHalvesInfo, getKeyboardLayout } from '../../../store';
import { AddKeymapAction } from '../../../store/actions/keymap';
import { KeyboardLayout } from '../../../keyboard/keyboard-layout.enum';

@Component({
    selector: 'keymap-add',
    templateUrl: './keymap-add.component.html',
    styleUrls: ['./keymap-add.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        'class': 'container-fluid'
    }
})
export class KeymapAddComponent {
    presets$: Observable<Keymap[]>;
    presetsAll$: Observable<Keymap[]>;
    keyboardLayout$: Observable<KeyboardLayout>;
    halvesInfo$: Observable<HalvesInfo>;
    faKeyboard = faKeyboard;
    faSearch = faSearch;

    private filterExpression$: BehaviorSubject<string>;

    constructor(private store: Store<AppState>) {
        this.keyboardLayout$ = store.select(getKeyboardLayout);
        this.halvesInfo$ = store.select(getHalvesInfo);
        this.presetsAll$ = store.select((appState: AppState) => appState.presetKeymaps);
        this.filterExpression$ = new BehaviorSubject('');

        this.presets$ = this.presetsAll$
            .pipe(
                combineLatest(this.filterExpression$, (keymaps: Keymap[], filterExpression: string) => {
                    return keymaps.filter((keymap: Keymap) => keymap.name.toLocaleLowerCase().includes(filterExpression));
                }),
                publishReplay(1),
                refCount()
            );
    }

    filterKeyboards(filterExpression: string) {
        this.filterExpression$.next(filterExpression);
    }

    addKeymap(keymap: Keymap) {
        this.store.dispatch(new AddKeymapAction(keymap));
    }
}
