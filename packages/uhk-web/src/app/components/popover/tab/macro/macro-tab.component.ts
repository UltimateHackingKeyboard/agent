import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { faCirclePlus, faCircleMinus, faPlus, faUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { copyRgbColor, KeyAction, Keymap, Macro, MacroArgumentAction, PlayMacroAction } from 'uhk-common';

import { Tab } from '../tab';
import { faBracketsWithDots } from '../../../../custom-fa-icons/index';

import { AppState, getMacros } from '../../../../store';
import { SelectedKeyModel } from '../../../../models';
import { RemapInfo } from '../../../../models/remap-info';
import { SelectOptionData } from '../../../../models/select-option-data';

@Component({
    selector: 'macro-tab',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false,
    templateUrl: './macro-tab.component.html',
    styleUrls: ['./macro-tab.component.scss']
})
export class MacroTabComponent extends Tab implements OnInit, OnChanges, OnDestroy {
    @Input() currentKeymap: Keymap;
    @Input() defaultKeyAction: KeyAction;
    @Input() macroPlaybackSupported: boolean;
    @Input() remapInfo: RemapInfo;
    @Input() selectedKey: SelectedKeyModel;

    @Output() assignNewMacro = new EventEmitter<KeyAction>();

    faBracketsWithDots = faBracketsWithDots;
    faCirclePlus = faCirclePlus;
    faCircleMinus = faCircleMinus;
    faPlus = faPlus;
    faUpRightFromSquare = faUpRightFromSquare;
    jumpToMacroQueryParams = {};
    macros: Macro[];
    macroOptions: Array<SelectOptionData>;
    playMacroAction: PlayMacroAction;
    selectedMacroIndex: number;
    showMacroArguments = false;
    showMacroArgumentsTooltip: string;
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

    ngOnChanges(changes: SimpleChanges) {
        if (changes.defaultKeyAction) {
            this.fromKeyAction(this.defaultKeyAction);
            this.validAction.emit(true);
        }

        if (changes.currentKeymap || changes.selectedKey) {
            let remapQueryParams = '';

            if (this.remapInfo) {
                remapQueryParams = `&remapOnAllKeymap=${this.remapInfo.remapOnAllKeymap}&remapOnAllLayer=${this.remapInfo.remapOnAllLayer}`;
            }

            this.jumpToMacroQueryParams = {
                backUrl: `/keymap/${encodeURIComponent(this.currentKeymap.abbreviation)}?layer=${this.selectedKey.layerId}&module=${this.selectedKey.moduleId}&key=${this.selectedKey.keyId}${remapQueryParams}`,
                backText: `"${this.currentKeymap.name}" keymap`,
            };
        }
    }

    onChange(id: string) {
        this.selectedMacroIndex = +id;
    }

    keyActionValid(): boolean {
        return this.selectedMacroIndex >= 0;
    }

    fromKeyAction(keyAction: KeyAction): boolean {
        if (!(keyAction instanceof PlayMacroAction)) {
            this.playMacroAction = new PlayMacroAction();
            return false;
        }
        this.playMacroAction = new PlayMacroAction(keyAction);
        this.selectedMacroIndex = this.macros.findIndex(macro => this.playMacroAction.macroId === macro.id);

        this.showMacroArguments = this.playMacroAction.macroArguments.length > 0
        this.calculateMacroArgumentsTooltip();

        return true;
    }

    toKeyAction(): PlayMacroAction {
        if (!this.keyActionValid()) {
            throw new Error('KeyAction is not valid. No selected macro!');
        }

        const keymapAction = new PlayMacroAction();
        keymapAction.macroArguments = this.playMacroAction.macroArguments;
        copyRgbColor(this.playMacroAction, keymapAction);
        keymapAction.macroId = this.macros[this.selectedMacroIndex].id;
        return keymapAction;
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    addNewMacroArgument(): void {
        const macroArgument = new MacroArgumentAction();
        macroArgument.value = '';
        this.playMacroAction.macroArguments.push(macroArgument);
    }

    removeMacroArgument(index: number): void {
        this.playMacroAction.macroArguments = this.playMacroAction.macroArguments.filter((arg: MacroArgumentAction, idx: number) => idx != index);
        if (this.playMacroAction.macroArguments.length === 0) {
            this.showMacroArguments = false;
            this.calculateMacroArgumentsTooltip();
        }
    }

    toggleMacroArguments() {
        this.showMacroArguments = !this.showMacroArguments;
        this.calculateMacroArgumentsTooltip();

        if (this.showMacroArguments && this.playMacroAction.macroArguments.length === 0) {
            this.addNewMacroArgument();
        }
    }

    trackByMacroArgumentsFn(index: number): string {
        return index.toString();
    }

    onMacroArgumentChange(value: string, index: number): void {
        const macroArgument = new MacroArgumentAction(this.playMacroAction.macroArguments[index])
        macroArgument.value = value;
        this.playMacroAction.macroArguments[index] = macroArgument;
    }

    private calculateMacroArgumentsTooltip(): void {
        this.showMacroArgumentsTooltip = this.showMacroArguments ? null : 'Add macro argument'
    }
}
