import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { RgbColor } from 'colord';

import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { BacklightingMode, HalvesInfo, KeyboardLayout, Keymap, LayerName } from 'uhk-common';

import { LastEditedKey, LayerOption, ModifyColorOfBacklightingColorPalettePayload } from '../../../models';
import { ChangeKeymapDescription } from '../../../models/ChangeKeymapDescription';
import { SelectOptionData } from '../../../models/select-option-data';

import {
    AppState,
    backlightingColorPalette,
    backlightingMode,
    getHalvesInfo,
    getKeyboardLayout,
    getLayerOptions,
    getSecondaryRoleOptions,
    getSelectedKeymap,
    getSelectedLayerOption,
    isBacklightingColoring,
    isKeymapDeletable,
    lastEditedKey,
    layerDoubleTapSupported,
    selectedBacklightingColorIndex,
    showColorPalette
} from '../../../store';
import {
    EditDescriptionAction,
    OpenPopoverAction,
    SelectKeymapAction,
    SelectLayerAction
} from '../../../store/actions/keymap';
import {
    AddColorToBacklightingColorPaletteAction,
    DeleteColorFromBacklightingColorPaletteAction,
    ModifyColorOfBacklightingColorPaletteAction,
    NavigateToModuleSettings,
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

    backlightingMode$: Observable<BacklightingMode>;
    currentLayer$: Observable<LayerOption>;
    deletable$: Observable<boolean>;
    isBacklightingColoring$: Observable<boolean>;
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
    private queryParamsSubscription: Subscription;
    private selectedLayer: LayerName;

    constructor(protected store: Store<AppState>,
                private route: ActivatedRoute,
                private router: Router,
                private cdRef: ChangeDetectorRef) {
        this.routeSubscription = route
            .params
            .pipe(
                map(params => params.abbr)
            )
            .subscribe(abbr => store.dispatch(new SelectKeymapAction(abbr)));

        this.queryParamsSubscription = route.queryParams.subscribe(params => {
            this.selectedLayer = params.layer ? +params.layer : LayerName.base;
            this.store.dispatch(new SelectLayerAction(this.selectedLayer));

            const moduleId = +params.module;
            const keyId = +params.key;

            this.store.dispatch(new OpenPopoverAction({
                moduleId: Number.isNaN(moduleId) ? undefined : moduleId,
                keyId: Number.isNaN(keyId) ? undefined : keyId,
                remapOnAllKeymap: params.remapOnAllKeymap === 'true',
                remapOnAllLayer: params.remapOnAllLayer === 'true'
            }));
        });

        this.backlightingMode$ = store.select(backlightingMode);
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
        this.isBacklightingColoring$ = store.select(isBacklightingColoring);
        this.layerOptions$ = this.store.select(getLayerOptions);
        this.secondaryRoleOptions$ = this.store.select(getSecondaryRoleOptions);
        this.showColorPalette$ = this.store.select(showColorPalette);
        this.paletteColors$ = this.store.select(backlightingColorPalette);
        this.selectedPaletteColorIndex$ = this.store.select(selectedBacklightingColorIndex);
    }

    ngOnDestroy(): void {
        this.routeSubscription.unsubscribe();
        this.keymapSubscription.unsubscribe();
        this.queryParamsSubscription.unsubscribe();
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

    modifyColorPaletteColor(event: ModifyColorOfBacklightingColorPalettePayload): void {
        this.store.dispatch(new ModifyColorOfBacklightingColorPaletteAction(event));
    }

    navigateToModuleSettings(moduleId: number): void {
        this.store.dispatch(new NavigateToModuleSettings({
            backUrl: `/keymap/${this.keymap.abbreviation}?layer=${this.selectedLayer}`,
            backText: `"${this.keymap.name}" keymap`,
            moduleId,
        }));
    }

    selectLayer(option: LayerOption): void {
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: {
                layer: option.id
            }
        });
    }

    toggleColorFromPalette(index: number): void {
        this.store.dispatch(new ToggleColorFromBacklightingColorPaletteAction(index));
    }
}
