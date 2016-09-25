import { Component, Input } from '@angular/core';

import { Store } from '@ngrx/store';

import { Macro } from '../../../config-serializer/config-items/Macro';

import { MacroActions } from '../../../store/actions';
import { AppState } from '../../../store/index';

@Component({
    selector: 'macro-header',
    template: require('./macro-header.component.html'),
    styles: [require('./macro-header.component.scss')]
})
export class MacroHeaderComponent {
    @Input() macro: Macro;

    constructor(private store: Store<AppState>) { }

    removeMacro() {
        this.store.dispatch(MacroActions.removeMacro(this.macro.id));
    }

    duplicateMacro() {
        this.store.dispatch(MacroActions.duplicateMacro(this.macro));
    }

    editMacroName(name: string) {
        this.store.dispatch(MacroActions.editMacroName(this.macro.id, name));
    }
}
