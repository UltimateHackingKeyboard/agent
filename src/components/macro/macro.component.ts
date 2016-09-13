import { Component, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs/Subscription';

import { DragulaService } from 'ng2-dragula/ng2-dragula';

import { Macro } from '../../config-serializer/config-items/Macro';
import { MacroAction } from '../../config-serializer/config-items/macro-action';
import { MacroItemComponent } from './macro-item/macro-item.component';

import { UhkConfigurationService } from '../../services/uhk-configuration.service';

@Component({
    selector: 'macro',
    template: require('./macro.component.html'),
    styles: [require('./macro.component.scss')],
    viewProviders: [DragulaService]
})
export class MacroComponent implements OnInit, OnDestroy {
    @ViewChildren(MacroItemComponent) macroItems: QueryList<MacroItemComponent>;

    private macro: Macro;

    private routeSubscription: Subscription;
    private hasChanges: boolean = false;
    private dragEnabled: boolean;

    constructor(
        private uhkConfigurationService: UhkConfigurationService,
        private route: ActivatedRoute,
        private dragulaService: DragulaService
    ) {
        /* tslint:disable:no-unused-variable: Used by Dragula. */
        dragulaService.setOptions('macroActions', {
            moves: function (el: any, container: any, handle: any) {
                return handle.className.includes('action--movable');
            }
        });
        /* tslint:enable:no-unused-variable */
    }

    ngOnInit() {
        this.routeSubscription = this.route.params.subscribe((params: { id: string }) => {
            const id: number = Number(params.id);
            this.macro = this.getMacro(id);
            this.dragEnabled = true;
            this.hasChanges = false;
        });
    }

    getMacro(id: number): Macro {
        const config = this.uhkConfigurationService.getUhkConfiguration();
        const macro: Macro = config.macros.elements.find(item => item.id === id);
        if (macro) {
            // Clone macro for editing
            return new Macro().fromJsObject(macro.toJsObject());
        }
        // @todo replace with notification
        throw new Error('Macro not found');
    }

    saveMacro() {
        // @todo Save macro to keyboard
    }

    addAction() {
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

    onNameChange() {
        this.hasChanges = true;
    }

    onEditAction(index: number) {
        // Hide other editors when clicking edit button of a macro action
        this.hideOtherActionEditors(index);
        this.dragEnabled = false;
    }

    onCancelEditAction() {
        this.dragEnabled = true;
    }

    onSaveAction(macroAction: MacroAction, index: number) {
        this.dragEnabled = true;
        this.hasChanges = true;
        this.macro.macroActions.elements[index] = macroAction;
    }

    onDeleteAction(index: number) {
        // @ todo show confirm action dialog
        this.macro.macroActions.elements.splice(index, 1);
        this.hasChanges = true;
    }

    ngOnDestroy() {
        this.routeSubscription.unsubscribe();
    }

}
