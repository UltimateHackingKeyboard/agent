import {Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';

import {Tab} from '../../popover/tab/tab';

import {MacroTextTabComponent} from './tab/macro-text/macro-text.component';
import {MacroDelayTabComponent} from './tab/macro-delay/macro-delay.component';
import {MacroKeyTabComponent} from './tab/macro-key/macro-key.component';
import {MacroMouseTabComponent} from './tab/macro-mouse/macro-mouse.component';

import {MacroItemComponent} from '../macro-item/macro-item.component';
import {MacroAction, macroActionType} from '../../../../config-serializer/config-items/MacroAction';

enum TabName {
    Keypress,
    Text,
    Mouse,
    Delay
};

@Component({
    moduleId: module.id,
    selector: 'macro-action-editor',
    template: require('./macro-action-editor.component.html'),
    styles: [ require('./macro-action-editor.component.scss') ],
    host: { 'class': 'macro-action-editor' },
    directives: [
        MacroTextTabComponent,
        MacroKeyTabComponent,
        MacroMouseTabComponent,
        MacroDelayTabComponent
    ]
})
export class MacroActionEditorComponent implements OnInit {
    @Input() macroAction: MacroAction;

    @Output() save = new EventEmitter<any>();
    @Output() cancel = new EventEmitter<any>();

    @ViewChild('tab') selectedTab: Tab;

    public isEnabled: boolean; // Can be controlled from MacroComponent via local variable interaction (#macroPopover)
    private editableMacroAction: MacroAction;
    private TabName = TabName;
    private activeTab: TabName;

    constructor() {
    }

    ngOnInit() {

    }

    toggleEnabled(state: boolean) {
        this.isEnabled = state;
        if (this.isEnabled) {
            // Make an editable clone of macro action so original isn't changed
            this.editableMacroAction = this.macroAction.clone();
            let tab: TabName = this.getTabName(this.editableMacroAction);
            this.selectTab(tab); 
        }
    }

    onCancelClick(): void {
        this.isEnabled = false;
        this.cancel.emit();
    }

    onSaveClick(): void {
        try {
            this.save.emit(this.editableMacroAction);
            this.isEnabled = false;
        } catch (e) {
            // TODO: show error dialog
            console.error(e);
        }
    }

    selectTab(tab: TabName): void {
        this.activeTab = tab;
    }

    getTabName(action: MacroAction) {
        const data = action.toJsObject();
        switch (data.macroActionType) {
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
