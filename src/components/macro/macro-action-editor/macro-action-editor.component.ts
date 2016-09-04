import {Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';

import {MacroAction, macroActionType} from '../../../config-serializer/config-items/MacroAction';
import {KeyMacroAction} from '../../../config-serializer/config-items/KeyMacroAction';
import {MacroKeyTabComponent} from './tab/macro-key';
import {cloneDeep as _cloneDeep } from 'lodash';

import {DelayMacroAction} from '../../../config-serializer/config-items/DelayMacroAction';
import {MouseButtonMacroAction} from '../../../config-serializer/config-items/MouseButtonMacroAction';
import {MoveMouseMacroAction} from '../../../config-serializer/config-items/MoveMouseMacroAction';
import {ScrollMouseMacroAction} from '../../../config-serializer/config-items/ScrollMouseMacroAction';
import {TextMacroAction} from '../../../config-serializer/config-items/TextMacroAction';

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
            this.editableMacroAction = _cloneDeep(this.macroAction);
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
            if (this.macroAction.macroActionType !== this.editableMacroAction.macroActionType) {
                this.editableMacroAction = this.convertToType(this.editableMacroAction.macroActionType, this.editableMacroAction);
            }
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
        this.editableMacroAction.macroActionType = this.getTabMacroActionType(tab);
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

    getTabMacroActionType(tab: TabName) {
        if (tab === TabName.Delay) {
            return macroActionType.DelayMacroAction;
        } else if (tab === TabName.Keypress) {
            return macroActionType.PressKeyMacroAction;
        } else if (tab === TabName.Mouse) {
            return macroActionType.PressMouseButtonsMacroAction;
        } else if (tab == TabName.Text) {
            return macroActionType.TextMacroAction;
        }
    }

    convertToType(actionType: string, action: MacroAction) {
        console.log('converting', action);
        switch(actionType) {
            // Delay action
            case macroActionType.DelayMacroAction:
                return new DelayMacroAction().fromJsObject(action);
            // Text action
            case macroActionType.TextMacroAction:
                return new TextMacroAction().fromJsObject(action);
            // Keypress actions
            case macroActionType.PressKeyMacroAction:
            case macroActionType.HoldKeyMacroAction:
            case macroActionType.ReleaseKeyMacroAction:
            case macroActionType.HoldModifiersMacroAction:
            case macroActionType.PressModifiersMacroAction:
            case macroActionType.ReleaseModifiersMacroAction:
                return new KeyMacroAction().fromJsObject(action);
            // Mouse actions
            case macroActionType.PressMouseButtonsMacroAction:
            case macroActionType.HoldMouseButtonsMacroAction:
            case macroActionType.ReleaseMouseButtonsMacroAction:
                return new MouseButtonMacroAction().fromJsObject(action);
            case macroActionType.MoveMouseMacroAction:
                return new MoveMouseMacroAction().fromJsObject(action);
            case macroActionType.ScrollMouseMacroAction:
                return new ScrollMouseMacroAction().fromJsObject(action);
            default:
                return action;
        }
    }

}
