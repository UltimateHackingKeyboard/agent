import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { RgbColor } from 'colord';
import { HalvesInfo, KeyboardLayout, Keymap } from 'uhk-common';

import { Observable, Subscription } from 'rxjs';
import { first, map, pluck } from 'rxjs/operators';

import {
    backlightingColorPalette,
    getUserConfiguration,
    getSelectedKeymap,
    isKeymapDeletable,
    layerDoubleTapSupported,
    AppState,
    getKeyboardLayout,
    lastEditedKey,
    getHalvesInfo,
    getLayerOptions,
    getSecondaryRoleOptions,
    getSelectedLayerOption,
    selectedBacklightingColorIndex,
    showColorPalette
} from '../../../store';
import { EditDescriptionAction, SelectKeymapAction, SelectLayerAction } from '../../../store/actions/keymap';
import { ChangeKeymapDescription } from '../../../models/ChangeKeymapDescription';
import { LastEditedKey, LayerOption } from '../../../models';
import { SelectOptionData } from '../../../models/select-option-data';
import {
    AddColorToBacklightingColorPaletteAction,
    DeleteColorFromBacklightingColorPaletteAction,
    ToggleColorFromBacklightingColorPaletteAction
} from '../../../store/actions/user-config';

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

    currentLayer$: Observable<LayerOption>;
    deletable$: Observable<boolean>;
    keymap$: Observable<Keymap>;
    keyboardLayout$: Observable<KeyboardLayout>;
    allowLayerDoubleTap$: Observable<boolean>;
    lastEditedKey$: Observable<LastEditedKey>;
    halvesInfo$: Observable<HalvesInfo>;
    keymap: Keymap;
    layerOptions$: Observable<LayerOption[]>;
    paletteColors$: Observable<Array<RgbColor>>;
    secondaryRoleOptions$: Observable<SelectOptionData[]>;
    selectedPaletteColorIndex$: Observable<number>;
    showColorPalette$: Observable<boolean>;

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

        this.currentLayer$ = store.select(getSelectedLayerOption);
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
        this.layerOptions$ = this.store.select(getLayerOptions);
        this.secondaryRoleOptions$ = this.store.select(getSecondaryRoleOptions);
        this.showColorPalette$ = this.store.select(showColorPalette);
        this.paletteColors$ = this.store.select(backlightingColorPalette);
        this.selectedPaletteColorIndex$ = this.store.select(selectedBacklightingColorIndex);
    }

    ngOnDestroy(): void {
        this.routeSubscription.unsubscribe();
        this.keymapSubscription.unsubscribe();
    }

    addColorToPalette(color: RgbColor): void {
        this.store.dispatch(new AddColorToBacklightingColorPaletteAction(color));
    }

    deleteColorFromPalette(): void {
        this.store.dispatch(new DeleteColorFromBacklightingColorPaletteAction());
    }

    descriptionChanged(event: ChangeKeymapDescription): void {
        this.store.dispatch(new EditDescriptionAction(event));
    }

    selectLayer(option: LayerOption): void {
        this.store.dispatch(new SelectLayerAction(option));
    }

    toggleColorFromPalette(index: number): void {
        this.store.dispatch(new ToggleColorFromBacklightingColorPaletteAction(index));
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
