import { Component, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Store } from '@ngrx/store';
import 'rxjs/add/operator/let';
import 'rxjs/add/operator/publishReplay';
import { Observable } from 'rxjs/Observable';
import { ConnectableObservable } from 'rxjs/observable/ConnectableObservable';

import { DragulaService } from 'ng2-dragula/ng2-dragula';

import { Macro } from '../../config-serializer/config-items/Macro';
import { MacroAction } from '../../config-serializer/config-items/macro-action/MacroAction';
import { MacroItemComponent } from './item/macro-item.component';

import { AppState } from '../../store';
import { getMacro } from '../../store/reducers/macro';

@Component({
    selector: 'macro',
    template: require('./macro.component.html'),
    styles: [require('./macro.component.scss')],
    viewProviders: [DragulaService]
})
export class MacroComponent {
    @ViewChildren(MacroItemComponent) macroItems: QueryList<MacroItemComponent>;
    private macro$: Observable<Macro>;
    private showNew: boolean = false;
    private newMacro: Macro = undefined;
    private activeEdit: number = undefined;

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

        let macroConnectable: ConnectableObservable<Macro> = route
            .params
            .select<number>('id')
            .switchMap((id: number) => store.let(getMacro(id)))
            .publishReplay(1);

        this.macro$ = macroConnectable;
        macroConnectable.connect();
    }

    showNewAction() {
        if (this.activeEdit) {
            this.hideActiveEditor();
        }

        this.newMacro = undefined;
        this.showNew = true;
    }

    hideNewAction() {
        this.showNew = false;
    }

    addNewAction(macroAction: MacroAction, id: number) {
        // TODO implement add
    }

    editAction(index: number) {
        // Hide other editors when clicking edit button of a macro action
        if (this.activeEdit) {
            this.hideActiveEditor();
        }

        this.activeEdit = index;
    }

    cancelAction() {
        this.activeEdit = undefined;
    }

    private hideActiveEditor() {
        this.macroItems.toArray().forEach((macroItem: MacroItemComponent, idx: number) => {
            if (idx !== this.activeEdit) {
                macroItem.cancelEdit();
            }
        });
    }

    /*

    discardChanges() {
        const id: number = this.macro.id;
        this.macro = this.getMacro(id);
    }

    saveItem(macroAction: MacroAction, index: number) {
        this.hasChanges = true;
        this.macro.macroActions[index] = macroAction;
    }

    deleteItem(index: number) {
        // @ todo show confirm action dialog
        this.macro.macroActions.splice(index, 1);
        this.hasChanges = true;
    }*/
}
