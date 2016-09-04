import { Component, OnInit, OnDestroy, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { cloneDeep as _cloneDeep } from 'lodash';

import { UhkConfigurationService } from '../../services/uhk-configuration.service';

import { Macro } from '../../config-serializer/config-items/Macro';
import { TextMacroAction } from '../../config-serializer/config-items/TextMacroAction';
import { MacroItemComponent } from './macro-item/macro-item.component';

import { DragulaService } from 'ng2-dragula/ng2-dragula';

@Component({
    selector: 'macro',
    template: require('./macro.component.html'),
    styles: [require('./macro.component.scss')],
    viewProviders: [DragulaService]
})
export class MacroComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChildren(MacroItemComponent) macroItems: QueryList<MacroItemComponent>;

    private macro: Macro;

    private sub: Subscription;
    private macroItemsSub: Subscription;
    private addedNewAction: boolean = false;
    private dragEnabled: boolean = true;

    constructor(
        private uhkConfigurationService: UhkConfigurationService,
        private route: ActivatedRoute,
        private dragulaService: DragulaService
    ) {
        /* tslint:disable:no-unused-variable: Used by Dragula. */
        dragulaService.setOptions('macroActions', {
            moves: function (el: any, container: any, handle: any) {
                return handle.className.indexOf('action--movable') !== -1;
            }
        });
        /* tslint:enable:no-unused-variable */
    }

    ngOnInit() {
        this.sub = this.route.params.subscribe((params: any) => {
            const id: number = params.id;
            this.macro = this.getMacro(id);
       });
    }

    ngAfterViewInit() {
       this.macroItemsSub = this.macroItems.changes.subscribe((data: any) => {
           if (this.addedNewAction) {
               // Open editor for newly added action
               // Rather cludge way to do this, basically macroItems have to be updated before the editor can be opened
               setTimeout(() => {
                   let newAction = data.last;
                   newAction.title = 'New macro action';
                   newAction.actionEditor.toggleEnabled(true);
                   this.hideOtherActionEditors(data.length - 1);
                   this.addedNewAction = false;
               });
           }
       });
    }

    getMacro(id: number) {
        const allMacros: Macro[] = this.uhkConfigurationService.getUhkConfiguration().macros.elements;
        const macro = allMacros[id];
        if (macro) {
            return _cloneDeep(macro);
        }
        return null;
    }

    saveMacro() {
        // @todo Save macro to keyboard
    }

    addAction() {
        const newAction = new TextMacroAction();
        newAction.text = '';
        this.macro.macroActions.elements.push(newAction);
        this.addedNewAction = true;
    }

    hideOtherActionEditors(index: number) {
        this.macroItems.toArray().forEach((macroItem: MacroItemComponent, idx: number) => {
            if (idx !== index) {
                macroItem.actionEditor.toggleEnabled(false);
            }
        });
    }

    onEditAction(index: number) {
        // Hide other editors when clicking edit button of a macro action
        this.hideOtherActionEditors(index);
        this.dragEnabled = false;
    }

    onCancelEditAction() {
      this.dragEnabled = true;
    }

    onSaveAction() {
      this.dragEnabled = true;
    }

    onDeleteAction(index: number) {
        // @ todo show confirm action dialog
        this.macro.macroActions.elements.splice(index, 1);
        this.saveMacro();
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
        this.macroItemsSub.unsubscribe();
    }

}
