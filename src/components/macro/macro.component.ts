import { Component, OnInit, OnDestroy, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { UhkConfigurationService } from '../../services/uhk-configuration.service';

import { Macro } from '../../config-serializer/config-items/Macro';
import { MacroAction } from '../../config-serializer/config-items/MacroAction';
import { TextMacroAction } from '../../config-serializer/config-items/TextMacroAction';
import { MacroItemComponent } from './macro-item/macro-item.component';

import { ContenteditableModel } from '../directives/contenteditable.component';

@Component({
    selector: 'macro',
    template: require('./macro.component.html'),
    styles: [require('./macro.component.scss')]
})
export class MacroComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChildren(MacroItemComponent) macroItems: QueryList<MacroItemComponent>; 
    
    private macro: Macro;

    private sub: Subscription;
    private macroItemsSub: Subscription;
    private addedNewAction: boolean = false;

    constructor(
        private uhkConfigurationService: UhkConfigurationService, 
        private route: ActivatedRoute,
    ) {}

    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            const id = +params['id']; // (+) converts string 'id' to a number
            const macros: Macro[] = this.uhkConfigurationService.getUhkConfiguration().macros.elements;
            this.macro = macros[id];
       });
    }

    ngAfterViewInit() {
       this.macroItemsSub = this.macroItems.changes.subscribe((data:any) => {
           if (this.addedNewAction) {
               // Open editor for newly added action
               // Rather cludge way to do this, basically macroItems have to be updated before the editor can be opened
               setTimeout(() => {
                   let newAction = data.last;
                   data.last.actionEditor.toggleEnabled(true);
                   this.hideOtherActionEditors(data.length - 1);
                   this.addedNewAction = false;
               });
           }
       });
    }

    saveMacro() {
        // @todo Save macro to keyboard
    }

    addAction() {
        const newAction = new TextMacroAction();
        newAction.text = 'New macro action';
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
    }

    onDeleteAction(index:number) {
        // @ todo show confirm action dialog
        this.macro.macroActions.elements.splice(index, 1);
        this.saveMacro();
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
        this.macroItemsSub.unsubscribe();
    }

}
