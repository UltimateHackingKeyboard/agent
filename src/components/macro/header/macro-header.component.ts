import { Component, Input } from '@angular/core';

import { Macro } from '../../../config-serializer/config-items/Macro';

@Component({
    selector: 'macro-header',
    template: require('./macro-header.component.html'),
    styles: [require('./macro-header.component.scss')]
})
export class MacroHeaderComponent {
    @Input() macro: Macro;

    constructor() { }

    removeMacro() {
        // TODO implement
    }

    duplicateMacro() {
        // TODO implement
    }

    /* tslint:disable:no-unused-variable */
    editMacroName(name: string) {
        // TODO implement
    }
}
