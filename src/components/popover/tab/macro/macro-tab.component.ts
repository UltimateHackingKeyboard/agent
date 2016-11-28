import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';

import { Subscription } from 'rxjs/Subscription';

import { Select2OptionData } from 'ng2-select2/ng2-select2';

import { KeyAction, PlayMacroAction } from '../../../../config-serializer/config-items/key-action';
import { Macro } from '../../../../config-serializer/config-items/Macro';

import { Tab } from '../tab';

import { AppState } from '../../../../store/index';
import { getMacroEntities } from '../../../../store/reducers/macro';

@Component({
    selector: 'macro-tab',
    template: require('./macro-tab.component.html'),
    styles: [require('./macro-tab.component.scss')]
})
export class MacroTabComponent implements OnInit, OnChanges, OnDestroy, Tab {
    @Input() defaultKeyAction: KeyAction;

    private macros: Macro[];
    private macroOptions: Array<Select2OptionData>;
    private selectedMacroIndex: number;
    private subscription: Subscription;

    constructor(private store: Store<AppState>) {
        this.subscription = store.let(getMacroEntities())
            .subscribe((macros: Macro[]) => this.macros = macros);
        this.macroOptions = [];
        this.selectedMacroIndex = 0;
    }

    ngOnInit() {
        this.macroOptions = this.macros.map(function (macro: Macro, index: number): Select2OptionData {
            return {
                id: index.toString(),
                text: macro.name
            };
        });
    }

    ngOnChanges() {
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

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
