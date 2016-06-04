import { Component, OnInit } from '@angular/core';

import { UhkConfigurationService } from '../../../services/uhk-configuration.service';
import { Macro } from '../../../../config-serializer/config-items/Macro';
import { PlayMacroAction } from '../../../../config-serializer/config-items/PlayMacroAction';

import { KeyActionSaver } from '../key-action-saver';
import { MacroItemComponent } from './macro-item.component';

@Component({
    moduleId: module.id,
    selector: 'macro-tab',
    template:
    `
        <div class="macro-selector">
            <b> Play macro: </b>
            <select [(ngModel)]="selectedMacroIndex">
                <option [ngValue]="-1"> Select macro </option>
                <option *ngFor="let macro of macros; let index=index" [ngValue]="index"> {{ macro.name }} </option>
            </select>
        </div>
        <div class="macro-action-container">
            <template [ngIf]="selectedMacroIndex >= 0">
                <macro-item *ngFor="let macroAction of macros[selectedMacroIndex].macroActions.elements"
                            [macroAction]="macroAction">
                </macro-item>
            </template>
        </div>
    `,
    styles: [require('./macro-tab.component.scss')],
    directives: [MacroItemComponent]
})
export class MacroTabComponent implements OnInit, KeyActionSaver {

    private macros: Macro[];
    private selectedMacroIndex: number;

    constructor(private uhkConfigurationService: UhkConfigurationService) {
        this.macros = [];
        this.selectedMacroIndex = -1;
    }

    ngOnInit() {
        this.macros = this.uhkConfigurationService.getUhkConfiguration().macros.elements;
    }

    keyActionValid(): boolean {
        return this.selectedMacroIndex !== -1;
    }

    toKeyAction(): PlayMacroAction {
        if (!this.keyActionValid()) {
            throw new Error('KeyAction is not valid. No selected macro!');
        }
        let keymapAction = new PlayMacroAction();
        keymapAction.macroId = this.macros[this.selectedMacroIndex].id;
        return keymapAction;
    }

}
