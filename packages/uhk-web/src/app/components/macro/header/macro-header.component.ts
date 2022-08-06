import {
    ChangeDetectionStrategy,
    Component,
    Input,
    OnChanges,
    SimpleChanges,
    ViewChild
} from '@angular/core';
import { Store } from '@ngrx/store';
import { faCopy, faPlay, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Constants, Macro } from 'uhk-common';

import { DuplicateMacroAction, EditMacroNameAction, RemoveMacroAction } from '../../../store/actions/macro';
import { AppState } from '../../../store';
import * as util from '../../../util';
import { AutoGrowInputComponent } from '../../auto-grow-input';

@Component({
    selector: 'macro-header',
    templateUrl: './macro-header.component.html',
    styleUrls: ['./macro-header.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MacroHeaderComponent implements OnChanges {
    @Input() macro: Macro;
    @Input() isNew: boolean;
    @Input() maxMacroCountReached: boolean;

    @ViewChild(AutoGrowInputComponent, { static: true }) macroName: AutoGrowInputComponent;

    faCopy = faCopy;
    faPlay = faPlay;
    faTrash = faTrash;
    maxAllowedMacrosTooltip = Constants.MAX_ALLOWED_MACROS_TOOLTIP;

    constructor(private store: Store<AppState>) {
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.macro) {
            this.macroName.writeValue(changes.macro.currentValue.name);
        }
    }

    removeMacro() {
        this.store.dispatch(new RemoveMacroAction(this.macro.id));
    }

    duplicateMacro() {
        if (this.maxMacroCountReached)
            return;

        this.store.dispatch(new DuplicateMacroAction(this.macro));
    }

    editMacroName(name: string) {
        if (!util.isValidName(name)) {
            return;
        }

        this.store.dispatch(new EditMacroNameAction({ id: this.macro.id, name }));
    }
}
