import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { HalvesInfo, Keymap } from 'uhk-common';

import { Observable, Subscription } from 'rxjs';
import { first, map, pluck } from 'rxjs/operators';

import {
    getUserConfiguration,
    getSelectedKeymap,
    isKeymapDeletable,
    layerDoubleTapSupported,
    AppState,
    getKeyboardLayout,
    lastEditedKey,
    getHalvesInfo
} from '../../../store';
import { KeyboardLayout } from '../../../keyboard/keyboard-layout.enum';
import { EditDescriptionAction, SelectKeymapAction } from '../../../store/actions/keymap';
import { ChangeKeymapDescription } from '../../../models/ChangeKeymapDescription';
import { LastEditedKey } from '../../../models';

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

    deletable$: Observable<boolean>;
    keymap$: Observable<Keymap>;
    keyboardLayout$: Observable<KeyboardLayout>;
    allowLayerDoubleTap$: Observable<boolean>;
    lastEditedKey$: Observable<LastEditedKey>;
    halvesInfo$: Observable<HalvesInfo>;
    keymap: Keymap;

    private routeSubscription: Subscription;
    private keymapSubscription: Subscription;

    constructor(protected store: Store<AppState>,
                private route: ActivatedRoute,
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
        this.lastEditedKey$ = store.select(lastEditedKey);
        this.halvesInfo$ = store.select(getHalvesInfo);
    }

    ngOnDestroy(): void {
        this.routeSubscription.unsubscribe();
        this.keymapSubscription.unsubscribe();
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
