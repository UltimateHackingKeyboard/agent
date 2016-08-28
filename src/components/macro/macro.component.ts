import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { UhkConfigurationService } from '../../services/uhk-configuration.service';

import { MacroPopoverComponent } from './macro-popover/macro-popover.component';
import { Macro } from '../../../config-serializer/config-items/Macro';
import { MacroAction } from '../../../config-serializer/config-items/MacroAction';
import { PressKeyMacroAction } from '../../../config-serializer/config-items/PressKeyMacroAction';
import { MacroItemComponent } from '../popover/tab/macro/macro-item.component';

@Component({
    selector: 'macro',
    template: require('./macro.component.html'),
    styles: [require('./macro.component.scss')],
    providers: [UhkConfigurationService],
    directives: [
        NgIf,
        NgFor,
        MacroPopoverComponent,
        MacroItemComponent
    ]
})
export class MacroComponent implements OnInit, OnDestroy {

    private popoverEnabled: boolean;
    private macro: Macro;
    private currentMacroAction: MacroAction;
    private sub: Subscription;

    constructor(private uhkConfigurationService: UhkConfigurationService, private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.popoverEnabled = false;
        this.sub = this.route.params.subscribe(params => {
            const id = +params['id']; // (+) converts string 'id' to a number
            const macros: Macro[] = this.uhkConfigurationService.getUhkConfiguration().macros.elements;
            this.macro = macros[id];
       });
    }

    addAction() {
        const newAction = new PressKeyMacroAction();
        this.currentMacroAction = newAction;
        this.popoverEnabled = true;
    }

    editAction(macroAction: MacroAction) {
        this.currentMacroAction = macroAction;
        this.popoverEnabled = true;
    }

    removeAction(action:MacroAction) {

    }

    hidePopover() {
        this.currentMacroAction = null;
        this.popoverEnabled = false;
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }
}
