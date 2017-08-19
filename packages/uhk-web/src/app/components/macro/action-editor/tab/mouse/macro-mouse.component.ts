import { Component, Input, OnInit, ViewChild } from '@angular/core';

import {
    MouseButtonMacroAction,
    MoveMouseMacroAction,
    ScrollMouseMacroAction,
    MacroSubAction
} from '../../../../../config-serializer/config-items/macro-action';
import { Tab } from '../../../../popover/tab';

type MouseMacroAction = MouseButtonMacroAction | MoveMouseMacroAction | ScrollMouseMacroAction;

enum TabName {
    Move,
    Scroll,
    Click,
    Hold,
    Release
}

@Component({
    selector: 'macro-mouse-tab',
    templateUrl: './macro-mouse.component.html',
    styleUrls: [
        '../../macro-action-editor.component.scss',
        './macro-mouse.component.scss'
    ],
    host: { 'class': 'macro__mouse' }
})
export class MacroMouseTabComponent implements OnInit {
    @Input() macroAction: MouseMacroAction;
    @ViewChild('tab') selectedTab: Tab;

    /* tslint:disable:variable-name: It is an enum type. So it can start with uppercase. */
    TabName = TabName;
    /* tslint:enable:variable-name */
    activeTab: TabName;
    buttonLabels: string[];
    private selectedButtons: boolean[];

    constructor() {
        this.buttonLabels = ['Left', 'Middle', 'Right'];
        this.selectedButtons = Array(this.buttonLabels.length).fill(false);
    }

    ngOnInit() {
        if (!this.macroAction) {
            this.macroAction = new MouseButtonMacroAction();
            this.macroAction.action = MacroSubAction.press;
        }
        const tabName = this.getTabName(this.macroAction);
        this.selectTab(tabName);
        const buttonActions = [TabName.Click, TabName.Hold, TabName.Release];
        if (buttonActions.includes(this.activeTab)) {
            this.selectedButtons = (<MouseButtonMacroAction>this.macroAction).getMouseButtons();
        }
    }

    ngOnChanges() {
        this.ngOnInit();
    }

    selectTab(tab: TabName): void {
        this.activeTab = tab;

        if (tab === this.getTabName(this.macroAction)) {
            return;
        }

        switch (tab) {
            case TabName.Scroll:
                this.macroAction = new ScrollMouseMacroAction();
                break;
            case TabName.Move:
                this.macroAction = new MoveMouseMacroAction();
                break;
            default:
                this.macroAction = new MouseButtonMacroAction();
                this.macroAction.action = this.getAction(tab);
                break;
        }
    }

    setMouseClick(index: number): void {
        this.selectedButtons[index] = !this.selectedButtons[index];
        (<MouseButtonMacroAction>this.macroAction).setMouseButtons(this.selectedButtons);
    }

    hasButton(index: number): boolean {
        return this.selectedButtons[index];
    }

    getAction(tab: TabName): MacroSubAction {
        switch (tab) {
            case TabName.Click:
                return MacroSubAction.press;
            case TabName.Hold:
                return MacroSubAction.hold;
            case TabName.Release:
                return MacroSubAction.release;
            default:
                throw new Error(`Invalid tab name: ${TabName[tab]}`);
        }
    }

    getTabName(action: MouseMacroAction): TabName {
        if (action instanceof MouseButtonMacroAction) {
            if (!action.action || action.isOnlyPressAction()) {
                return TabName.Click;
            } else if (action.isOnlyHoldAction()) {
                return TabName.Hold;
            } else if (action.isOnlyReleaseAction()) {
                return TabName.Release;
            }
        } else if (action instanceof MoveMouseMacroAction) {
            return TabName.Move;
        } else if (action instanceof ScrollMouseMacroAction) {
            return TabName.Scroll;
        }
        return TabName.Move;
    }

}
