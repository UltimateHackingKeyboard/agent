import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Keymap } from 'uhk-common';

import { Observable, Subscription } from 'rxjs';
import { combineLatest, first, map, pluck, switchMap } from 'rxjs/operators';

import { saveAs } from 'file-saver';

import {
    getUserConfiguration,
    getSelectedKeymap,
    isKeymapDeletable,
    layerDoubleTapSupported,
    AppState,
    getKeyboardLayout
} from '../../../store';
import { KeyboardLayout } from '../../../keyboard/keyboard-layout.enum';
import { EditDescriptionAction, SelectKeymapAction } from '../../../store/actions/keymap';
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
export class KeymapEditComponent implements OnDestroy {

    keyboardSplit: boolean;

    deletable$: Observable<boolean>;
    keymap$: Observable<Keymap>;
    keyboardLayout$: Observable<KeyboardLayout>;
    allowLayerDoubleTap$: Observable<boolean>;
    keymap: Keymap;

    private routeSubscription: Subscription;
    private keymapSubscription: Subscription;

    constructor(protected store: Store<AppState>,
                route: ActivatedRoute,
                private cdRef: ChangeDetectorRef) {
        this.routeSubscription = route
            .params
            .pipe(
                pluck<{}, string>('abbr')
            )
            .subscribe(abbr => store.dispatch(new SelectKeymapAction(abbr)));

        this.keymap$ = store.select(getSelectedKeymap);
        this.keymapSubscription = this.keymap$
            .subscribe(keymap => {
                this.keymap = keymap;
                this.cdRef.markForCheck();
            });

        this.deletable$ = store.select(isKeymapDeletable);

        this.keyboardLayout$ = store.select(getKeyboardLayout);
        this.allowLayerDoubleTap$ = store.select(layerDoubleTapSupported);
    }

    ngOnDestroy(): void {
        this.routeSubscription.unsubscribe();
        this.keymapSubscription.unsubscribe();
    }

    downloadKeymap() {
        const exportableJSON$: Observable<string> = this.keymap$
            .pipe(
                switchMap(keymap => this.toExportableJSON(keymap)),
                map(exportableJSON => JSON.stringify(exportableJSON))
            );

        this.keymap$
            .pipe(
                combineLatest(exportableJSON$),
                first()
            )
            .subscribe(latest => {
                const keymap = latest[0];
                const exportableJSON = latest[1];
                const fileName = keymap.name + '_keymap.json';
                saveAs(new Blob([exportableJSON], { type: 'application/json' }), fileName);
            });
    }

    @HostListener('window:keydown.alt.s', ['$event'])
    toggleKeyboardSplit() {
        this.keyboardSplit = !this.keyboardSplit;
    }

    descriptionChanged(event: ChangeKeymapDescription): void {
        this.store.dispatch(new EditDescriptionAction(event));
    }

    private toExportableJSON(keymap: Keymap): Observable<any> {
        return this.store
            .select(getUserConfiguration)
            .pipe(
                first(),
                map(userConfiguration => {
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
                })
            );
    }
}
