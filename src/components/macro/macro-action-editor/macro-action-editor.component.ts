import {Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';

import {MacroAction, macroActionType} from '../../../config-serializer/config-items/MacroAction';
import {KeyMacroAction} from '../../../config-serializer/config-items/KeyMacroAction';
import {MacroKeyTabComponent} from './tab/macro-key';

enum TabName {
    Keypress,
    Text,
    Mouse,
    Delay
};

@Component({
    selector: 'macro-action-editor',
    template: require('./macro-action-editor.component.html'),
    styles: [ require('./macro-action-editor.component.scss') ],
    host: { 'class': 'macro-action-editor' }
})
export class MacroActionEditorComponent implements OnInit {
    @Input() macroAction: MacroAction;

    @Output() save = new EventEmitter<any>();
    @Output() cancel = new EventEmitter<any>();

    @ViewChild('tab') selectedTab: any;

    public enabled: boolean; // Can be controlled from MacroComponent via local variable interaction (#macroPopover)
    private editableMacroAction: MacroAction;
    private activeTab: TabName;
    /* tslint:disable:variable-name: It is an enum type. So it can start with uppercase. */
    /* tslint:disable:no-unused-variable: It is used in the template. */
    private TabName = TabName;
    /* tslint:enable:no-unused-variable */
    /* tslint:enable:variable-name */

    constructor() {
    }

    ngOnInit() {

    }

    toggleEnabled(state: boolean) {
        this.enabled = state;
        if (this.enabled) {
            // Make an editable clone of macro action so original isn't changed
            this.editableMacroAction = this.macroAction.clone();
            let tab: TabName = this.getTabName(this.editableMacroAction);
            this.selectTab(tab);
        }
    }

    onCancelClick(): void {
        this.enabled = false;
        this.cancel.emit();
    }

    onSaveClick(): void {
        try {
            if (this.editableMacroAction instanceof KeyMacroAction) {
                // Could updating the saved keys be done in a better way?
                const action: KeyMacroAction = this.editableMacroAction as KeyMacroAction;
                const tab = this.selectedTab as MacroKeyTabComponent;
                action.fromKeyAction(tab.getKeyAction());
            }
            this.save.emit(this.editableMacroAction);
            this.enabled = false;
        } catch (e) {
            // TODO: show error dialog
            console.error(e);
        }
    }

    selectTab(tab: TabName): void {
        this.activeTab = tab;
    }

    getTabName(action: MacroAction) {
        switch (action.macroActionType) {
            // Delay action
            case macroActionType.DelayMacroAction:
                return TabName.Delay;
            // Text action
            case macroActionType.TextMacroAction:
                return TabName.Text;
            // Keypress actions
            case macroActionType.PressKeyMacroAction:
            case macroActionType.HoldKeyMacroAction:
            case macroActionType.ReleaseKeyMacroAction:
            case macroActionType.HoldModifiersMacroAction:
            case macroActionType.PressModifiersMacroAction:
            case macroActionType.ReleaseModifiersMacroAction:
                return TabName.Keypress;
            // Mouse actions
            case macroActionType.PressMouseButtonsMacroAction:
            case macroActionType.HoldMouseButtonsMacroAction:
            case macroActionType.ReleaseMouseButtonsMacroAction:
            case macroActionType.MoveMouseMacroAction:
            case macroActionType.ScrollMouseMacroAction:
                return TabName.Mouse;
            default:
                return TabName.Keypress;
        }
    }

}
