import { DOCUMENT } from '@angular/common';
import { Inject } from '@angular/core';
import { Injectable, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { AppState, isBacklightingColoring } from '../store/index';

/**
 * This service track the mouse move event between svg-keyboard-key elements
 */
@Injectable()
export class KeyActionMouseMoveService implements OnDestroy {
    private coloring = false;
    private isLeftButtonDown = false;

    private subscriptions = new Subscription();

    constructor(
        @Inject(DOCUMENT) private _document: Document,
        private _store: Store<AppState>
    ) {
        this._document.addEventListener('mouseup', this.leftButtonUp.bind(this));
        this.subscriptions.add(this._store.select(isBacklightingColoring).subscribe(coloring => this.coloring = coloring));
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
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
