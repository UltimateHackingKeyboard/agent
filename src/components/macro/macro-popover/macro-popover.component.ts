import {Component, OnInit, OnChanges, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import {NgIf, NgSwitch, NgSwitchCase } from '@angular/common';

import {Tab} from '../../popover/tab/tab';

import {KeypressTabComponent} from '../../popover/tab/keypress/keypress-tab.component';
import {MouseTabComponent} from '../../popover/tab/mouse/mouse-tab.component';

import {MacroTextTabComponent} from './tab/macro-text/macro-text.component';
import {MacroDelayTabComponent} from './tab/macro-delay/macro-delay.component';
import {MacroMouseTabComponent} from './tab/macro-mouse/macro-mouse.component';

import {MacroItemComponent} from '../../popover/tab/macro/macro-item.component';
import {MacroAction, macroActionType} from '../../../../config-serializer/config-items/MacroAction';

enum TabName {
    Keypress,
    Text,
    Mouse,
    Delay
};

@Component({
    moduleId: module.id,
    selector: 'macro-popover',
    template: require('./macro-popover.component.html'),
    styles: [
        require('../../popover/popover.component.scss'),
        require('./macro-popover.component.scss')
    ],
    host: { 'class': 'popover macro-action' },
    directives: [
        NgIf,
        NgSwitch,
        NgSwitchCase,
        KeypressTabComponent,
        MouseTabComponent,
        MacroTextTabComponent,
        MacroDelayTabComponent
    ]
})
export class MacroPopoverComponent implements OnInit, OnChanges {
    @Input() macroAction: MacroAction;

    @Output() cancel = new EventEmitter<any>();
    @Output() save = new EventEmitter<any>();

    @ViewChild('tab') selectedTab: Tab;

    public isEnabled: boolean; // Can be controlled from MacroComponent via local variable interaction (#macroPopover)
    private editableMacroAction: MacroAction;
    private TabName = TabName;
    private activeTab: TabName;

    constructor() {
    }

    ngOnInit() {

    }

    ngOnChanges(changes: any) {
        if (this.isEnabled) {
            // Make an editable clone of macro action so original isn't changed
            this.editableMacroAction = this.macroAction.clone();
            let tab: TabName = this.getTabName(this.macroAction);
            this.selectTab(tab); 
        }
    }

    onCancelClick(): void {
        this.isEnabled = false;
        this.cancel.emit(undefined);
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
