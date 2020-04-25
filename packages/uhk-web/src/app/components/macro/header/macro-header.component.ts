import {
    ChangeDetectionStrategy,
    Component,
    Input
} from '@angular/core';
import { Store } from '@ngrx/store';
import { faCopy, faPlay, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Macro } from 'uhk-common';

import { DuplicateMacroAction, EditMacroNameAction, RemoveMacroAction } from '../../../store/actions/macro';
import { AppState } from '../../../store';
import * as util from '../../../util';

@Component({
    selector: 'macro-header',
    templateUrl: './macro-header.component.html',
    styleUrls: ['./macro-header.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MacroHeaderComponent {
    @Input() macro: Macro;
    @Input() isNew: boolean;

    faCopy = faCopy;
    faPlay = faPlay;
    faTrash = faTrash;

    constructor(private store: Store<AppState>) {
    }

    removeMacro() {
        this.store.dispatch(new RemoveMacroAction(this.macro.id));
    }

    duplicateMacro() {
        this.store.dispatch(new DuplicateMacroAction(this.macro));
    }

    editMacroName(name: string) {
        if (!util.isValidName(name)) {
            return;
        }

        this.store.dispatch(new EditMacroNameAction({ id: this.macro.id, name }));
    }
}
