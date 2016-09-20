import { Component } from '@angular/core';
import { Store } from '@ngrx/store';

import 'rxjs/add/operator/publishReplay';
import { Observable } from 'rxjs/Observable';
import { ConnectableObservable } from 'rxjs/observable/ConnectableObservable';

import { Keymap } from '../../../config-serializer/config-items/Keymap';
import { AppState } from '../../../store';
import { KeymapActions } from '../../../store/actions';

@Component({
    selector: 'keymap-add',
    template: require('./keymap-add.component.html'),
    styles: [require('./keymap-add.component.scss')]
})
export class KeymapAddComponent {
    private presets$: Observable<Keymap[]>;
    private presetsAll$: Observable<Keymap[]>;

    constructor(private store: Store<AppState>) {
        let presetConnectable: ConnectableObservable<Keymap[]> = store
            .select((appState: AppState) => appState.presetKeymaps)
            .publishReplay();

        this.presets$ = presetConnectable;
        presetConnectable.connect();

        this.presetsAll$ = store.select((appState: AppState) => appState.presetKeymaps);
    }

    filterKeyboards(value: string) {
        let presetConnectable: ConnectableObservable<Keymap[]> = this.presetsAll$
            .map((keymaps: Keymap[]) => keymaps.filter(
                (keymap: Keymap) => keymap.name.toLocaleLowerCase().includes(value))
            )
            .publishReplay();

        this.presets$ = presetConnectable;
        presetConnectable.connect();
    }

    addKeymap(keymap: Keymap) {
        this.store.dispatch(KeymapActions.addKeymap(keymap));
    }
}
