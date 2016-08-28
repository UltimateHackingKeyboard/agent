import {Component, OnInit, Input, Output, EventEmitter, ViewChild} from '@angular/core';
import {NgSwitch, NgSwitchCase} from '@angular/common';

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
        NgSwitch,
        NgSwitchCase,
        KeypressTabComponent,
        MouseTabComponent,
        MacroTextTabComponent,
        MacroDelayTabComponent
    ]
})
export class MacroPopoverComponent implements OnInit {
    @Input() macroAction: MacroAction;

    @Output() cancel = new EventEmitter<any>();
    @Output() save = new EventEmitter<any>();

    @ViewChild('tab') selectedTab: Tab;

    private editableMacroAction: MacroAction;
    private TabName = TabName;
    private activeTab: TabName;

    constructor() {
    }

    ngOnInit() {
        this.editableMacroAction = this.macroAction.clone();
        let tab: TabName = this.getTabName(this.macroAction);
        this.selectTab(tab);
    }

    onCancelClick(): void {
        this.cancel.emit(undefined);
    }

    onSaveClick(): void {
        try {
            this.save.emit(this.macroAction);
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
