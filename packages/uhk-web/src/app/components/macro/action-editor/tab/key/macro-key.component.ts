import { Component, Input, OnInit, ViewChild } from '@angular/core';

import { KeystrokeAction } from '../../../../../config-serializer/config-items/key-action';
import { KeyMacroAction, MacroSubAction } from '../../../../../config-serializer/config-items/macro-action';
import { KeypressTabComponent, Tab } from '../../../../popover/tab';

enum TabName {
    Keypress,
    Hold,
    Release
}

@Component({
    selector: 'macro-key-tab',
    templateUrl: './macro-key.component.html',
    styleUrls: [
        '../../macro-action-editor.component.scss',
        './macro-key.component.scss'
    ],
    host: { 'class': 'macro__mouse' }
})
export class MacroKeyTabComponent implements OnInit {
    @Input() macroAction: KeyMacroAction;
    @ViewChild('tab') selectedTab: Tab;
    @ViewChild('keypressTab') keypressTab: KeypressTabComponent;

    /* tslint:disable:variable-name: It is an enum type. So it can start with uppercase. */
    TabName = TabName;
    /* tslint:enable:variable-name */
    activeTab: TabName;
    defaultKeyAction: KeystrokeAction;

    ngOnInit() {
        if (!this.macroAction) {
            this.macroAction = new KeyMacroAction();
        }
        this.defaultKeyAction = new KeystrokeAction(<any>this.macroAction);
        this.selectTab(this.getTabName(this.macroAction));
    }

    selectTab(tab: TabName): void {
        this.activeTab = tab;
    }

    getTabName(macroAction: KeyMacroAction): TabName {
        if (!macroAction.action) {
            return TabName.Keypress;
        } else if (macroAction.action === MacroSubAction.hold) {
            return TabName.Hold;
        } else if (macroAction.action === MacroSubAction.release) {
            return TabName.Release;
        }
    }

    getActionType(tab: TabName): MacroSubAction {
        switch (tab) {
            case TabName.Keypress:
                return MacroSubAction.press;
            case TabName.Hold:
                return MacroSubAction.hold;
            case TabName.Release:
                return MacroSubAction.release;
            default:
                throw new Error('Invalid tab type');
        }
    }

    getKeyMacroAction(): KeyMacroAction {
        const keyMacroAction = Object.assign(new KeyMacroAction(), this.keypressTab.toKeyAction());
        keyMacroAction.action = this.getActionType(this.activeTab);
        return keyMacroAction;
    }

}
