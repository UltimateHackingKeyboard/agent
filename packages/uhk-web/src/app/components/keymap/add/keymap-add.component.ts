import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { faKeyboard } from '@fortawesome/free-solid-svg-icons';
import { Observable, Subscription } from 'rxjs';
import { HalvesInfo, Keymap } from 'uhk-common';

import { LayerOption } from '../../../models';
import {
    AppState,
    getHalvesInfo,
    getKeyboardLayout,
    getLayerOptionsAddKeymap,
    getSelectedAddKeymap,
    getSelectedLayerOptionAddKeymap
} from '../../../store';
import { SelectLayerAction } from '../../../store/actions/default-user-configuration.actions';
import { KeyboardLayout } from '../../../keyboard/keyboard-layout.enum';
import { AddKeymapAction } from '../../../store/actions/keymap';

@Component({
    selector: 'keymap-add',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './keymap-add.component.html',
    styleUrls: ['keymap-add.component.scss'],
    host: {
        'class': 'container-fluid'
    }
})
export class KeymapAddComponent implements OnDestroy, OnInit {
    currentLayer$: Observable<LayerOption>;
    faKeyboard = faKeyboard;
    halvesInfo$: Observable<HalvesInfo>;
    keyboardLayout$: Observable<KeyboardLayout>;
    keymap: Keymap;
    layerOptions$: Observable<LayerOption[]>;

    private subscription = new Subscription();

    constructor(private store: Store<AppState>,
                private cdRef: ChangeDetectorRef) {
    }

    ngOnInit(): void {
        this.currentLayer$ = this.store.select(getSelectedLayerOptionAddKeymap);
        this.halvesInfo$ = this.store.select(getHalvesInfo);
        this.keyboardLayout$ = this.store.select(getKeyboardLayout);
        this.layerOptions$ = this.store.select(getLayerOptionsAddKeymap);
        this.subscription.add(
            this.store.select(getSelectedAddKeymap).subscribe(keymap => {
                this.keymap = keymap;
                this.cdRef.detectChanges();
            }));
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    addKeymap(): void {
        this.store.dispatch(new AddKeymapAction(this.keymap));
    }

    selectLayer(option: LayerOption): void {
        this.store.dispatch(new SelectLayerAction(option));
    }
}
