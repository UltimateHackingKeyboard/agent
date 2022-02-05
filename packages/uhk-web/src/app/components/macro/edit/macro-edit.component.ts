import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Macro, MacroAction } from 'uhk-common';

import { Observable, Subscription } from 'rxjs';

import {
    AddMacroActionAction,
    DeleteMacroActionAction,
    ReorderMacroActionAction,
    SaveMacroActionAction
} from '../../../store/actions/macro';
import { AppState, getSelectedMacro, isMacroCommandSupported, isSelectedMacroNew, macroPlaybackSupported } from '../../../store';

@Component({
    selector: 'macro-edit',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './macro-edit.component.html',
    styleUrls: ['./macro-edit.component.scss'],
    host: {
        'class': 'container-fluid'
    }
})
export class MacroEditComponent implements OnDestroy {
    macro: Macro;
    isNew$: Observable<boolean>;
    macroId: number;
    macroPlaybackSupported$: Observable<boolean>;
    isMacroCommandSupported$: Observable<boolean>;

    private selectedMacroSubscription: Subscription;

    constructor(private store: Store<AppState>,
                private cdRef: ChangeDetectorRef,
                public route: ActivatedRoute) {
        this.selectedMacroSubscription = store.select(getSelectedMacro)
            .subscribe((macro: Macro) => {
                this.macro = macro;
                this.cdRef.markForCheck();
            });

        this.isNew$ = this.store.select(isSelectedMacroNew);
        this.macroPlaybackSupported$ = this.store.select(macroPlaybackSupported);
        this.isMacroCommandSupported$ = this.store.select(isMacroCommandSupported);
    }

    ngOnDestroy() {
        this.selectedMacroSubscription.unsubscribe();
    }

    addAction(macroId: number, action: MacroAction) {
        this.store.dispatch(new AddMacroActionAction({ id: macroId, action }));
    }

    editAction(macroId: number, index: number, action: MacroAction) {
        this.store.dispatch(new SaveMacroActionAction({ id: macroId, index, action }));
    }

    deleteAction(macroId: number, index: number, action: MacroAction) {
        this.store.dispatch(new DeleteMacroActionAction({ id: macroId, index, action }));
    }

    reorderAction(macroId: number, macroActions: MacroAction[]) {
        this.store.dispatch(new ReorderMacroActionAction({ id: macroId, macroActions }));
    }
}
