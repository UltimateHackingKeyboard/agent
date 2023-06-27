import { DOCUMENT } from '@angular/common';
import { Inject } from '@angular/core';
import { Injectable, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { defaultRgbColor, RgbColorInterface } from 'uhk-common';

import { AppState, isBacklightingColoring, selectedBacklightingColor } from '../store/index';

/**
 * This service track the mouse move event between svg-keyboard-key elements
 */
@Injectable()
export class KeyActionColoringService implements OnDestroy {
    private coloring = false;
    private isLeftButtonDown = false;
    private _selectedBacklightingColor: RgbColorInterface = defaultRgbColor();
    private subscriptions = new Subscription();

    constructor(
        @Inject(DOCUMENT) private _document: Document,
        private _store: Store<AppState>
    ) {
        this._document.addEventListener('mouseup', this.leftButtonUp.bind(this));
        this.subscriptions.add(this._store.select(isBacklightingColoring).subscribe(coloring => this.coloring = coloring));
        this.subscriptions.add(this._store.select(selectedBacklightingColor).subscribe(color => this._selectedBacklightingColor = color));
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    get isColoring() {
        return this.coloring;
    }

    get selectedBacklightingColor() {
        return this._selectedBacklightingColor;
    }

    leftButtonDown(): void {
        this.isLeftButtonDown = true;
    }

    leftButtonUp(event: MouseEvent): void {
        this.isLeftButtonDown = false;
    }

    shouldDispatchKeyColoring(): boolean {
        return this.coloring && this.isLeftButtonDown;
    }
}
