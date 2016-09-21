import { Component, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Store } from '@ngrx/store';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/let';
import 'rxjs/add/operator/publishReplay';
import { Observable } from 'rxjs/Observable';
import { ConnectableObservable } from 'rxjs/observable/ConnectableObservable';

import { DragulaService } from 'ng2-dragula/ng2-dragula';

import { Macro } from '../../config-serializer/config-items/Macro';
import { MacroItemComponent } from './item/macro-item.component';

import { AppState } from '../../store/index';
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
    private hasChanges: boolean = false;

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
            .do(() => {
                this.hasChanges = false;
            })
            .publishReplay();

        this.macro$ = macroConnectable;
        macroConnectable.connect();
    }

    /*addAction() {
        this.hideOtherActionEditors(this.macro.macroActions.elements.length);
        this.macro.macroActions.elements.push(undefined);
    }

    discardChanges() {
        const id: number = this.macro.id;
        this.macro = this.getMacro(id);
        this.hasChanges = false;
    }

    hideOtherActionEditors(index: number) {
        this.macroItems.toArray().forEach((macroItem: MacroItemComponent, idx: number) => {
            if (idx !== index) {
                macroItem.cancelEdit();
            }
        });
    }

    onEditAction(index: number) {
        // Hide other editors when clicking edit button of a macro action
        this.hideOtherActionEditors(index);
    }

    onSaveAction(macroAction: MacroAction, index: number) {
        this.hasChanges = true;
        this.macro.macroActions[index] = macroAction;
    }

    onDeleteAction(index: number) {
        // @ todo show confirm action dialog
        this.macro.macroActions.splice(index, 1);
        this.hasChanges = true;
    }*/
}
