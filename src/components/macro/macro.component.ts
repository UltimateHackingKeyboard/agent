import { Component, OnDestroy, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import '@ngrx/core/add/operator/select';
import { Store } from '@ngrx/store';
import 'rxjs/add/operator/let';
import 'rxjs/add/operator/switchMap';
import { Subscription } from 'rxjs/Subscription';

import { DragulaService } from 'ng2-dragula/ng2-dragula';

import { Macro } from '../../config-serializer/config-items/Macro';
import { MacroAction } from '../../config-serializer/config-items/macro-action';
import { MacroItemComponent } from './item/macro-item.component';

import { AppState } from '../../store';
import { MacroActions } from '../../store/actions';
import { getMacro } from '../../store/reducers/macro';

@Component({
    selector: 'macro',
    template: require('./macro.component.html'),
    styles: [require('./macro.component.scss')],
    viewProviders: [DragulaService]
})
export class MacroComponent implements OnDestroy {
    @ViewChildren(MacroItemComponent) macroItems: QueryList<MacroItemComponent>;
    private macro: Macro;
    private showNew: boolean = false;
    private newMacro: Macro = undefined;
    private activeEdit: number = undefined;
    private dragIndex: number;
    private subscription: Subscription;

    constructor(
        private store: Store<AppState>,
        private route: ActivatedRoute,
        private dragulaService: DragulaService
    ) {
        /* tslint:disable:no-unused-variable: Used by Dragula. */
        dragulaService.setOptions('macroActions', {
            moves: function (el: any, container: any, handle: any) {
                return handle.className.includes('action--movable');
            }
        });

        dragulaService.drag.subscribe((value: any) => {
            this.dragIndex = +value[1].getAttribute('data-index');
        });

        dragulaService.drop.subscribe((value: any) => {
            if (value[4]) {
                this.store.dispatch(MacroActions.reorderMacroAction(
                    this.macro.id,
                    this.dragIndex,
                    +value[4].getAttribute('data-index')
                ));
            }
        });

        this.subscription = route
            .params
            .select<string>('id')
            .switchMap((id: string) => store.let(getMacro(+id)))
            .subscribe((macro: Macro) => {
                this.macro = macro;
            });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    showNewAction() {
        this.hideActiveEditor();

        this.newMacro = undefined;
        this.showNew = true;
    }

    hideNewAction() {
        this.showNew = false;
    }

    addNewAction(macroAction: MacroAction) {
        this.store.dispatch(MacroActions.addMacroAction(this.macro.id, macroAction));
        this.newMacro = undefined;
        this.showNew = false;
    }

    editAction(index: number) {
        // Hide other editors when clicking edit button of a macro action
        this.hideActiveEditor();
        this.showNew = false;
        this.activeEdit = index;
    }

    cancelAction() {
        this.activeEdit = undefined;
    }

    saveAction(macroAction: MacroAction, index: number) {
        this.store.dispatch(MacroActions.saveMacroAction(this.macro.id, index, macroAction));
        this.hideActiveEditor();
    }

    deleteAction(macroAction: MacroAction, index: number) {
        this.store.dispatch(MacroActions.deleteMacroAction(this.macro.id, index, macroAction));
        this.hideActiveEditor();
    }

    private hideActiveEditor() {
        if (this.activeEdit !== undefined) {
            this.macroItems.toArray()[this.activeEdit].cancelEdit();
        }
    }
}
