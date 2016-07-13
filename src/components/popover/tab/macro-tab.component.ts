import { Component, OnInit } from '@angular/core';

import { UhkConfigurationService } from '../../../services/uhk-configuration.service';
import { Macro } from '../../../../config-serializer/config-items/Macro';
import { PlayMacroAction } from '../../../../config-serializer/config-items/PlayMacroAction';

import { KeyActionSaver } from '../key-action-saver';
import { MacroItemComponent } from './macro-item.component';

import {SELECT2_DIRECTIVES} from 'ng2-select2/dist/ng2-select2';
import {OptionData} from 'ng2-select2/dist/select2';

@Component({
    moduleId: module.id,
    selector: 'macro-tab',
    template: require('./macro-tab.component.html'),
    styles: [require('./macro-tab.component.scss')],
    directives: [MacroItemComponent, SELECT2_DIRECTIVES]
})
export class MacroTabComponent implements OnInit, KeyActionSaver {

    private macros: Macro[];
    private macrosOptions: Array<OptionData> = [];
    private selectedMacroIndex: number;

    constructor(private uhkConfigurationService: UhkConfigurationService) {
        this.macros = [];
        this.selectedMacroIndex = -1;
    }

    ngOnInit() {
        this.macros = this.uhkConfigurationService.getUhkConfiguration().macros.elements;

        this.macrosOptions.push({
            id: '-1',
            text: 'Select macro'
        });

        this.macrosOptions = this.macrosOptions.concat(this.macros.map(function(macro: Macro): OptionData {
            return {
                id: macro.id.toString(),
                text: macro.name
            };
        }));
    }

    // TODO: change to the correct type when the wrapper has added it.
    onChange(event: any) {
        this.selectedMacroIndex = event.value;
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
