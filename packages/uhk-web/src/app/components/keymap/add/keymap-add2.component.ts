import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { faKeyboard } from '@fortawesome/free-solid-svg-icons';
import { Observable, Subscription } from 'rxjs';
import { HalvesInfo, Keymap } from 'uhk-common';

import { AppState, getHalvesInfo, getKeyboardLayout, getSelectedAddKeymap } from '../../../store';
import { KeyboardLayout } from '../../../keyboard/keyboard-layout.enum';

@Component({
    selector: 'keymap-add2',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './keymap-add2.component.html',
    styleUrls: ['keymap-add2.component.scss'],
    host: {
        'class': 'container-fluid'
    }
})
export class KeymapAdd2Component implements OnDestroy, OnInit {
    faKeyboard = faKeyboard;
    halvesInfo$: Observable<HalvesInfo>;
    keyboardLayout$: Observable<KeyboardLayout>;
    keymap: Keymap;

    private subscription = new Subscription();

    constructor(private store: Store<AppState>,
                private cdRef: ChangeDetectorRef) {
    }

    ngOnInit(): void {
        this.halvesInfo$ = this.store.select(getHalvesInfo);
        this.keyboardLayout$ = this.store.select(getKeyboardLayout);
        this.subscription.add(
            this.store.select(getSelectedAddKeymap).subscribe(keymap => {
                this.keymap = keymap;
                this.cdRef.detectChanges();
            }));
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}
