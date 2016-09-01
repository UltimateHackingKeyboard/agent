import {Component, OnInit, Input} from '@angular/core';

import {UhkConfigurationService} from '../../../../services/uhk-configuration.service';
import {Macro} from '../../../../config-serializer/config-items/Macro';
import {KeyAction} from '../../../../config-serializer/config-items/KeyAction';
import {PlayMacroAction} from '../../../../config-serializer/config-items/PlayMacroAction';

import {Tab} from '../tab';
import {MacroItemComponent} from '../../../macro/macro-item/macro-item.component';

import {Select2Component, Select2OptionData} from 'ng2-select2/ng2-select2';

@Component({
    moduleId: module.id,
    selector: 'macro-tab',
    template: require('./macro-tab.component.html'),
    styles: [require('./macro-tab.component.scss')],
    directives: [MacroItemComponent, Select2Component]
})
export class MacroTabComponent implements OnInit, Tab {
    @Input() defaultKeyAction: KeyAction;

    private macros: Macro[];
    private macroOptions: Array<Select2OptionData>;
    private selectedMacroIndex: number;

    constructor(private uhkConfigurationService: UhkConfigurationService) {
        this.macros = [];
        this.macroOptions = [];
        this.selectedMacroIndex = -1;
    }

    ngOnInit() {
        this.macros = this.uhkConfigurationService.getUhkConfiguration().macros.elements;

        this.macroOptions.push({
            id: '-1',
            text: 'Select macro'
        });

        this.macroOptions = this.macroOptions.concat(this.macros.map(function (macro: Macro): Select2OptionData {
            return {
                id: macro.id.toString(),
                text: macro.name
            };
        }));
        this.fromKeyAction(this.defaultKeyAction);
    }

    // TODO: change to the correct type when the wrapper has added it.
    onChange(event: any) {
        this.selectedMacroIndex = +event.value;
    }

    keyActionValid(): boolean {
        return this.selectedMacroIndex >= 0;
    }

    fromKeyAction(keyAction: KeyAction): boolean {
        if (!(keyAction instanceof PlayMacroAction)) {
            return false;
        }
        let playMacroAction: PlayMacroAction = <PlayMacroAction>keyAction;
        this.selectedMacroIndex = this.macros.findIndex(macro => playMacroAction.macroId === macro.id);
        return true;
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
