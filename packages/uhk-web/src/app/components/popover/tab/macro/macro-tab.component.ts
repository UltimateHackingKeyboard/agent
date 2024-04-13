import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { faPlus, faUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { copyRgbColor, KeyAction, Macro, PlayMacroAction } from 'uhk-common';

import { Tab } from '../tab';

import { AppState, getMacros } from '../../../../store';
import { SelectOptionData } from '../../../../models/select-option-data';

@Component({
    selector: 'macro-tab',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './macro-tab.component.html',
    styleUrls: ['./macro-tab.component.scss']
})
export class MacroTabComponent extends Tab implements OnInit, OnChanges, OnDestroy {
    @Input() defaultKeyAction: KeyAction;
    @Input() macroPlaybackSupported: boolean;

    @Output() assignNewMacro = new EventEmitter<void>();

    faPlus = faPlus;
    faUpRightFromSquare = faUpRightFromSquare;
    macros: Macro[];
    macroOptions: Array<SelectOptionData>;
    selectedMacroIndex: number;
    private subscription: Subscription;

    constructor(store: Store<AppState>) {
        super();
        this.subscription = store.select(getMacros)
            .subscribe((macros: Macro[]) => this.macros = macros);
        this.macroOptions = [];
        this.selectedMacroIndex = 0;
    }

    ngOnInit() {
        this.macroOptions = this.macros.map(function (macro: Macro, index: number): SelectOptionData {
            return {
                id: index.toString(),
                text: macro.name
            };
        });
    }

    ngOnChanges() {
        this.fromKeyAction(this.defaultKeyAction);
        this.validAction.emit(true);
    }

    onChange(id: string) {
        this.selectedMacroIndex = +id;
    }

    keyActionValid(): boolean {
        return this.selectedMacroIndex >= 0;
    }

    fromKeyAction(keyAction: KeyAction): boolean {
        if (!(keyAction instanceof PlayMacroAction)) {
            return false;
        }
        const playMacroAction: PlayMacroAction = <PlayMacroAction>keyAction;
        this.selectedMacroIndex = this.macros.findIndex(macro => playMacroAction.macroId === macro.id);
        return true;
    }

    toKeyAction(): PlayMacroAction {
        if (!this.keyActionValid()) {
            throw new Error('KeyAction is not valid. No selected macro!');
        }

        const keymapAction = new PlayMacroAction();
        copyRgbColor(this.defaultKeyAction, keymapAction);
        keymapAction.macroId = this.macros[this.selectedMacroIndex].id;
        return keymapAction;
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
