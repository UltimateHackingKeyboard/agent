import { Component, OnInit, OnDestroy, Renderer, ViewChild, ElementRef } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { UhkConfigurationService } from '../../services/uhk-configuration.service';

import { MacroPopoverComponent } from './macro-popover/macro-popover.component';
import { Macro } from '../../../config-serializer/config-items/Macro';
import { MacroAction } from '../../../config-serializer/config-items/MacroAction';
import { PressKeyMacroAction } from '../../../config-serializer/config-items/PressKeyMacroAction';
import { MacroItemComponent } from '../popover/tab/macro/macro-item.component';

import { ContenteditableModel } from '../directives/contenteditable.component';

@Component({
    selector: 'macro',
    template: require('./macro.component.html'),
    styles: [require('./macro.component.scss')],
    providers: [UhkConfigurationService],
    directives: [
        NgIf,
        NgFor,
        MacroPopoverComponent,
        MacroItemComponent,
        ContenteditableModel
    ]
})
export class MacroComponent implements OnInit, OnDestroy {
    @ViewChild('macroNameInput') nameInput: ElementRef;
    @ViewChild('macroPopover') macroPopover: MacroPopoverComponent;

    private macro: Macro;
    private currentMacroAction: MacroAction;
    private currentMacroActionIndex: number;

    private sub: Subscription;

    constructor(
        private uhkConfigurationService: UhkConfigurationService, 
        private route: ActivatedRoute,
        private renderer: Renderer
    ) {
    }

    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            const id = +params['id']; // (+) converts string 'id' to a number
            const macros: Macro[] = this.uhkConfigurationService.getUhkConfiguration().macros.elements;
            this.macro = macros[id];
       });
    }

    saveMacro() {
        // @todo Save macro to keyboard
    }

    addAction() {
        const newAction = new PressKeyMacroAction();
        this.currentMacroAction = newAction;
        this.currentMacroActionIndex = this.macro.macroActions.elements.length;
        this.macroPopover.isEnabled = true;
    }

    editAction(macroAction: MacroAction, index: number) {
        this.currentMacroAction = macroAction;
        this.currentMacroActionIndex = index;
        this.macroPopover.isEnabled = true;
    }

    saveEditedAction(macroAction: MacroAction) {
        // @todo save this to keyboard
        console.log('saved action', macroAction);
        this.macro.macroActions.elements[this.currentMacroActionIndex] = macroAction;
        this.currentMacroAction = null;
        this.currentMacroActionIndex = null;
    }

    deleteAction(index:number) {
        // @ todo show confirm action dialog
        this.macro.macroActions.elements.splice(index, 1);
        this.saveMacro();
    }

    hidePopover() {
        this.currentMacroAction = null;
    }

    focusMacroName() {
        this.renderer.invokeElementMethod(this.nameInput.nativeElement, 'focus');
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

}
