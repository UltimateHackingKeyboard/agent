import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

import {
    EditableMacroAction,
    MacroAction,
    TextMacroAction,
    macroActionType
} from '../../../config-serializer/config-items/macro-action';
import { MacroKeyTabComponent } from './tab/key';

enum TabName {
    Keypress,
    Text,
    Mouse,
    Delay
};

@Component({
    selector: 'macro-action-editor',
    template: require('./macro-action-editor.component.html'),
    styles: [require('./macro-action-editor.component.scss')],
    host: { 'class': 'macro-action-editor' }
})
export class MacroActionEditorComponent implements OnInit {
    @Input() macroAction: MacroAction;

    @Output() save = new EventEmitter<MacroAction>();
    @Output() cancel = new EventEmitter<void>();

    @ViewChild('tab') selectedTab: any;

    private editableMacroAction: EditableMacroAction;
    private activeTab: TabName;
    /* tslint:disable:variable-name: It is an enum type. So it can start with uppercase. */
    /* tslint:disable:no-unused-variable: It is used in the template. */
    private TabName = TabName;
    /* tslint:enable:no-unused-variable */
    /* tslint:enable:variable-name */

    ngOnInit() {
        let macroAction: MacroAction = this.macroAction ? this.macroAction : new TextMacroAction();
        this.editableMacroAction = new EditableMacroAction(macroAction.toJsObject());
        let tab: TabName = this.getTabName(this.editableMacroAction);
        this.activeTab = tab;
    }

    onCancelClick(): void {
        this.cancel.emit();
    }

    onSaveClick(): void {
        try {
            const action = this.editableMacroAction;
            if (action.isKeyAction()) {
                // Could updating the saved keys be done in a better way?
                const tab = this.selectedTab as MacroKeyTabComponent;
                action.fromKeyAction(tab.getKeyAction());
            }
            this.save.emit(action.toClass());
        } catch (e) {
            // TODO: show error dialog
            console.error(e);
        }
    }

    selectTab(tab: TabName): void {
        this.activeTab = tab;
        this.editableMacroAction.macroActionType = this.getTabMacroActionType(tab);
    }

    getTabName(action: EditableMacroAction): TabName {
        switch (action.macroActionType) {
            // Delay action
            case macroActionType.DelayMacroAction:
                return TabName.Delay;
            // Text action
            case macroActionType.TextMacroAction:
                return TabName.Text;
            // Keypress actions
            case macroActionType.KeyMacroAction:
                return TabName.Keypress;
            // Mouse actions
            case macroActionType.MouseButtonMacroAction:
            case macroActionType.MoveMouseMacroAction:
            case macroActionType.ScrollMouseMacroAction:
                return TabName.Mouse;
            default:
                return TabName.Keypress;
        }
    }

    getTabMacroActionType(tab: TabName): string {
        switch (tab) {
            case TabName.Delay:
                return macroActionType.DelayMacroAction;
            case TabName.Keypress:
                return macroActionType.KeyMacroAction;
            case TabName.Mouse:
                return macroActionType.MouseButtonMacroAction;
            case TabName.Text:
                return macroActionType.TextMacroAction;
            default:
                throw new Error('Could not get macro action type');
        }
    }

}
