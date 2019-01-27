import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Macro, MacroAction } from 'uhk-common';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { pluck, switchMap } from 'rxjs/operators';

import { MacroActions } from '../../../store/actions';
import { AppState, macroPlaybackSupported } from '../../../store';
import { getMacro } from '../../../store/reducers/user-configuration';

@Component({
    selector: 'macro-edit',
    templateUrl: './macro-edit.component.html',
    styleUrls: ['./macro-edit.component.scss'],
    host: {
        class: 'container-fluid'
    }
})
export class MacroEditComponent implements OnDestroy {
    macro: Macro;
    isNew: boolean;
    macroId: number;
    macroPlaybackSupported$: Observable<boolean>;

    private subscription: Subscription;

    constructor(private store: Store<AppState>, public route: ActivatedRoute) {
        this.subscription = route.params
            .pipe(
                pluck<{}, string>('id'),
                switchMap((id: string) => {
                    this.macroId = +id;
                    return store.let(getMacro(this.macroId));
                })
            )
            .subscribe((macro: Macro) => {
                this.macro = macro;
            });

        this.isNew = this.route.snapshot.params['empty'] === 'new';
        this.macroPlaybackSupported$ = this.store.select(macroPlaybackSupported);
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    addAction(macroId: number, action: MacroAction) {
        this.store.dispatch(MacroActions.addMacroAction(macroId, action));
    }

    editAction(macroId: number, index: number, action: MacroAction) {
        this.store.dispatch(MacroActions.saveMacroAction(macroId, index, action));
    }

    deleteAction(macroId: number, index: number, action: MacroAction) {
        this.store.dispatch(MacroActions.deleteMacroAction(macroId, index, action));
    }

    reorderAction(macroId: number, oldIndex: number, newIndex: number) {
        this.store.dispatch(MacroActions.reorderMacroAction(macroId, oldIndex, newIndex));
    }
}
