import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Store } from '@ngrx/store';

import { Subscription } from 'rxjs/Subscription';

import { Macro } from '../../../config-serializer/config-items/Macro';
import { MacroAction } from '../../../config-serializer/config-items/macro-action/MacroAction';

import { MacroActions } from '../../../store/actions';
import { AppState } from '../../../store/index';
import { getMacro } from '../../../store/reducers/user-configuration';

@Component({
    selector: 'macro-edit',
    templateUrl: './macro-edit.component.html',
    styleUrls: ['./macro-edit.component.scss'],
    host: {
        'class': 'container-fluid'
    }
})
export class MacroEditComponent implements OnDestroy {
    private subscription: Subscription;
    private macro: Macro;
    private isNew: boolean;

    constructor(private store: Store<AppState>, public route: ActivatedRoute) {
        this.subscription = route
            .params
            .select<string>('id')
            .switchMap((id: string) => store.let(getMacro(+id)))
            .subscribe((macro: Macro) => {
                this.macro = macro;
            });

        this.isNew = this.route.snapshot.params['empty'] === 'new';
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
