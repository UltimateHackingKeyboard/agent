import { ChangeDetectionStrategy, Component, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Keymap } from 'uhk-common';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/let';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/publishReplay';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/pluck';
import 'rxjs/add/operator/combineLatest';

import { saveAs } from 'file-saver';

import { layerDoubleTapSupported, AppState, getKeyboardLayout } from '../../../store';
import { getKeymap, getKeymaps, getUserConfiguration } from '../../../store/reducers/user-configuration';
import { KeyboardLayout } from '../../../keyboard/keyboard-layout.enum';
import { KeymapActions } from '../../../store/actions';
import { ChangeKeymapDescription } from '../../../models/ChangeKeymapDescription';

@Component({
    selector: 'keymap-edit',
    templateUrl: './keymap-edit.component.html',
    styleUrls: ['./keymap-edit.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        'class': 'container-fluid'
    }
})
export class KeymapEditComponent {

    keyboardSplit: boolean;

    deletable$: Observable<boolean>;
    keymap$: Observable<Keymap>;
    keyboardLayout$: Observable<KeyboardLayout>;
    allowLayerDoubleTap$: Observable<boolean>;

    constructor(protected store: Store<AppState>,
                route: ActivatedRoute) {
        this.keymap$ = route
            .params
            .pluck<{}, string>('abbr')
            .switchMap((abbr: string) => store.let(getKeymap(abbr)))
            .publishReplay(1)
            .refCount();

        this.deletable$ = store.let(getKeymaps())
            .map((keymaps: Keymap[]) => keymaps.length > 1);

        this.keyboardLayout$ = store.select(getKeyboardLayout);
        this.allowLayerDoubleTap$ = store.select(layerDoubleTapSupported);
    }

    downloadKeymap() {
        const exportableJSON$: Observable<string> = this.keymap$
            .switchMap(keymap => this.toExportableJSON(keymap))
            .map(exportableJSON => JSON.stringify(exportableJSON));

        this.keymap$
            .combineLatest(exportableJSON$)
            .first()
            .subscribe(latest => {
                const keymap = latest[0];
                const exportableJSON = latest[1];
                const fileName = keymap.name + '_keymap.json';
                saveAs(new Blob([exportableJSON], {type: 'application/json'}), fileName);
            });
    }

    @HostListener('window:keydown.alt.s', ['$event'])
    toggleKeyboardSplit() {
        this.keyboardSplit = !this.keyboardSplit;
    }

    descriptionChanged(event: ChangeKeymapDescription): void {
        this.store.dispatch(new KeymapActions.EditDescriptionAction(event));
    }

    private toExportableJSON(keymap: Keymap): Observable<any> {
        return this.store
            .let(getUserConfiguration())
            .first()
            .map(userConfiguration => {
                return {
                    site: 'https://ultimatehackingkeyboard.com',
                    description: 'Ultimate Hacking Keyboard keymap',
                    keyboardModel: 'UHK60',
                    userConfigMajorVersion: userConfiguration.userConfigMajorVersion,
                    userConfigMinorVersion: userConfiguration.userConfigMinorVersion,
                    userConfigPatchVersion: userConfiguration.userConfigPatchVersion,
                    objectType: 'keymap',
                    objectValue: keymap.toJsonObject()
                };
            });
    }
}
