import {Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';

import {EditableMacroAction} from '../../../config-serializer/config-items/macro-action/EditableMacroAction';
import {MacroAction, macroActionType} from '../../../config-serializer/config-items/macro-action/MacroAction';
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

    @Output() save = new EventEmitter<MacroAction>();
    @Output() cancel = new EventEmitter<void>();

    @ViewChild('tab') selectedTab: any;

    public enabled: boolean; // Can be controlled from MacroComponent via local variable interaction (#macroPopover)
    private editableMacroAction: EditableMacroAction;
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
            this.editableMacroAction = new EditableMacroAction().fromJsObject(this.macroAction.toJsObject());
            let tab: TabName = this.getTabName(this.editableMacroAction);
            this.activeTab = tab;
        }
    }

    onCancelClick(): void {
        this.enabled = false;
        this.cancel.emit();
    }

    onSaveClick(): void {
        try {
            const action = this.editableMacroAction as EditableMacroAction;
            if (action.isKeyAction()) {
                // Could updating the saved keys be done in a better way?
                const tab = this.selectedTab as MacroKeyTabComponent;
                action.fromKeyAction(tab.getKeyAction());
            }
            this.save.emit(action.toClass());
            this.enabled = false;
        } catch (e) {
            // TODO: show error dialog
            console.error(e);
        }
    }

    selectTab(tab: TabName): void {
        this.activeTab = tab;
        this.editableMacroAction.macroActionType = this.getTabMacroActionType(tab);
    }

    getTabName(action: EditableMacroAction) {
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

    getTabMacroActionType(tab: TabName) {
        if (tab === TabName.Delay) {
            return macroActionType.DelayMacroAction;
        } else if (tab === TabName.Keypress) {
            return macroActionType.KeyMacroAction;
        } else if (tab === TabName.Mouse) {
            return macroActionType.MouseButtonMacroAction;
        } else if (tab === TabName.Text) {
            return macroActionType.TextMacroAction;
        }
    }

}
