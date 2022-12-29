import {
    OnInit,
    Component,
    Input,
    Output,
    EventEmitter,
} from '@angular/core';
import { CommandMacroAction } from 'uhk-common';

import { SelectedMacroActionId } from '../../../../../models';
import { hasNonAsciiCharacters } from '../../../../../util';
import { MacroBaseComponent } from '../macro-base.component';

@Component({
    selector: 'macro-command-tab',
    templateUrl: './macro-command.component.html',
    styleUrls: ['./macro-command.component.scss'],
    host: { 'class': 'macro__text' }
})
export class MacroCommandComponent extends MacroBaseComponent implements OnInit {
    @Input() index: SelectedMacroActionId;
    @Input() isActive: boolean;
    @Input() macroAction: CommandMacroAction;

    @Output() ctrlEnterKeyDown = new EventEmitter<void>();
    @Output() gotFocus = new EventEmitter<void>();

    constructor() { super(); }

    ngOnInit() {
        this.init();
    }

    onCommandChanged(command: string) {
        this.init();
        this.macroAction.command = command;
        this.validate();
    }

    isMacroValid = () => !!this.macroAction.command && !hasNonAsciiCharacters(this.macroAction.command);

    private init = () => {
        if (!this.macroAction) {
            this.macroAction = new CommandMacroAction();
        }
    };

}
