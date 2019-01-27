import { Component, Input, OnInit, ViewChild } from '@angular/core';

import { KeyMacroAction, KeystrokeAction, MacroKeySubAction } from 'uhk-common';
import { KeypressTabComponent, Tab } from '../../../../popover/tab';
import { MacroBaseComponent } from '../macro-base.component';

enum TabName {
    Tap,
    Press,
    Release,
}

@Component({
    selector: 'macro-key-tab',
    templateUrl: './macro-key.component.html',
    styleUrls: ['../../macro-action-editor.component.scss', './macro-key.component.scss'],
    host: { class: 'macro__mouse' },
})
export class MacroKeyTabComponent extends MacroBaseComponent implements OnInit {
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
        this.validate();
    }

    getTabName(macroAction: KeyMacroAction): TabName {
        if (!macroAction.action) {
            return TabName.Tap;
        } else if (macroAction.action === MacroKeySubAction.press) {
            return TabName.Press;
        } else if (macroAction.action === MacroKeySubAction.release) {
            return TabName.Release;
        }
    }

    getActionType(tab: TabName): MacroKeySubAction {
        switch (tab) {
            case TabName.Tap:
                return MacroKeySubAction.tap;
            case TabName.Press:
                return MacroKeySubAction.press;
            case TabName.Release:
                return MacroKeySubAction.release;
            default:
                throw new Error('Invalid tab type');
        }
    }

    getKeyMacroAction(): KeyMacroAction {
        const keyMacroAction = new KeyMacroAction(this.keypressTab.toKeyAction() as any);
        keyMacroAction.action = this.getActionType(this.activeTab);
        return keyMacroAction;
    }

    isMacroValid = () => {
        const keyMacroAction = this.getKeyMacroAction();
        return !!keyMacroAction.scancode || !!keyMacroAction.modifierMask;
    };
}
