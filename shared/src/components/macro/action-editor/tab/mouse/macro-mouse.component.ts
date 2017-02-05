import { Component, Input, OnInit, ViewChild } from '@angular/core';

import { EditableMacroAction, MacroSubAction, macroActionType } from '../../../../../config-serializer/config-items/macro-action';
import { Tab } from '../../../../popover/tab';

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
    @Input() macroAction: EditableMacroAction;
    @ViewChild('tab') selectedTab: Tab;

    private activeTab: TabName;
    private buttonLabels: string[];
    private selectedButtons: boolean[];
    /* tslint:disable:variable-name: It is an enum type. So it can start with uppercase. */
    /* tslint:disable:no-unused-variable: It is used in the template. */
    private TabName = TabName;
    /* tslint:enable:no-unused-variable */
    /* tslint:enable:variable-name */

    constructor() {
        this.buttonLabels = ['Left', 'Middle', 'Right'];
        this.selectedButtons = Array(this.buttonLabels.length).fill(false);
    }

    ngOnInit() {
        const tabName = this.getTabName(this.macroAction);
        this.selectTab(tabName);
        const buttonActions = [TabName.Click, TabName.Hold, TabName.Release];
        if (buttonActions.includes(this.activeTab)) {
            this.selectedButtons = this.macroAction.getMouseButtons();
        }
    }

    selectTab(tab: TabName): void {
        this.activeTab = tab;
        this.macroAction.macroActionType = this.getMacroActionType(tab);
        if (this.macroAction.macroActionType === macroActionType.MouseButtonMacroAction) {
            this.macroAction.action = this.getAction(tab);
        }
    }

    setMouseClick(index: number): void {
        this.selectedButtons[index] = !this.selectedButtons[index];
        this.macroAction.setMouseButtons(this.selectedButtons);
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
                throw new Error('Invalid tab name');
        }
    }

    getTabName(action: EditableMacroAction): TabName {
        if (action.macroActionType === macroActionType.MouseButtonMacroAction) {
            if (!action.action || action.isOnlyPressAction()) {
                return TabName.Click;
            } else if (action.isOnlyPressAction()) {
                return TabName.Hold;
            } else if (action.isOnlyReleaseAction()) {
                return TabName.Release;
            }
        } else if (action.macroActionType === macroActionType.MoveMouseMacroAction) {
            return TabName.Move;
        } else if (action.macroActionType === macroActionType.ScrollMouseMacroAction) {
            return TabName.Scroll;
        }
        return TabName.Move;
    }

    getMacroActionType(tab: TabName): string {
        if (tab === TabName.Click || tab === TabName.Hold || tab === TabName.Release) {
            return macroActionType.MouseButtonMacroAction;
        } else if (tab === TabName.Move) {
            return macroActionType.MoveMouseMacroAction;
        } else if (tab === TabName.Scroll) {
            return macroActionType.ScrollMouseMacroAction;
        }
    }

}
