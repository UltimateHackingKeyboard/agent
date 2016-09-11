import { Component, Input, OnInit, ViewChild } from '@angular/core';

import { KeyAction } from '../../../../../config-serializer/config-items/key-action';
import { EditableMacroAction, MacroSubAction } from '../../../../../config-serializer/config-items/macro-action';
import { KeypressTabComponent } from '../../../../popover/tab/keypress';
import { Tab } from '../../../../popover/tab/tab';

enum TabName {
    Keypress,
    Hold,
    Release
}

@Component({
    selector: 'macro-key-tab',
    template: require('./macro-key.component.html'),
    styles: [
        require('../../macro-action-editor.component.scss'),
        require('./macro-key.component.scss')
    ],
    host: { 'class': 'macro__mouse' }
})
export class MacroKeyTabComponent implements OnInit {
    @Input() macroAction: EditableMacroAction;
    @ViewChild('tab') selectedTab: Tab;
    @ViewChild('keypressTab') keypressTab: KeypressTabComponent;

    private defaultKeyAction: KeyAction;

    private activeTab: TabName;
    /* tslint:disable:variable-name: It is an enum type. So it can start with uppercase. */
    /* tslint:disable:no-unused-variable: It is used in the template. */
    private TabName = TabName;
    /* tslint:enable:no-unused-variable */
    /* tslint:enable:variable-name */

    ngOnInit() {
        this.defaultKeyAction = this.macroAction.toKeyAction();
        this.selectTab(this.getTabName(this.macroAction));
    }

    selectTab(tab: TabName): void {
        this.activeTab = tab;
        this.macroAction.action = this.getActionType(tab);
    }

    getTabName(action: EditableMacroAction) {
        if (!action.action || action.isOnlyPressAction()) {
            return TabName.Keypress;
        } else if (action.isOnlyHoldAction()) {
            return TabName.Hold;
        } else if (action.isOnlyReleaseAction()) {
            return TabName.Release;
        }
    }

    getActionType(tab: TabName) {
        if (tab === TabName.Keypress) {
            return MacroSubAction.press;
        } else if (tab === TabName.Hold) {
            return MacroSubAction.hold;
        } else if (tab === TabName.Release) {
            return MacroSubAction.release;
        }
    }

    getKeyAction() {
        return this.keypressTab.toKeyAction();
    }

}
