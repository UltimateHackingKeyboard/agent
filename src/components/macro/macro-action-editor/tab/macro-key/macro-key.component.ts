import {
    Component,
    OnInit,
    Input,
    ViewChild
} from '@angular/core';

import {Tab} from '../../../../popover/tab/tab';
import {macroActionType} from '../../../../../config-serializer/config-items/MacroAction';
import {EditableMacroAction} from '../../../../../config-serializer/config-items/EditableMacroAction';
import {KeyAction} from '../../../../../config-serializer/config-items/KeyAction';
import {KeypressTabComponent} from '../../../../popover/tab/keypress';

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

    constructor() {}

    ngOnInit() {
        this.defaultKeyAction = this.macroAction.toKeyAction();
        this.selectTab(this.getTabName(this.macroAction));
    }

    selectTab(tab: TabName): void {
        this.activeTab = tab;
        this.macroAction.macroActionType = this.getMacroActionType(tab);
    }

    getTabName(action: EditableMacroAction) {
        switch (action.macroActionType) {
            // Press key
            case macroActionType.PressKeyMacroAction:
            case macroActionType.PressModifiersMacroAction:
                return TabName.Keypress;
            // Hold key
            case macroActionType.HoldKeyMacroAction:
            case macroActionType.HoldModifiersMacroAction:
                return TabName.Hold;
            // Release key
            case macroActionType.ReleaseKeyMacroAction:
            case macroActionType.ReleaseModifiersMacroAction:
                return TabName.Release;

            default:
                return TabName.Keypress;
        }
    }

    getMacroActionType(tab: TabName) {
        if (tab === TabName.Keypress) {
            return macroActionType.PressKeyMacroAction;
        } else if (tab === TabName.Hold) {
            return macroActionType.HoldKeyMacroAction;
        } else if (tab === TabName.Release) {
            return macroActionType.ReleaseKeyMacroAction;
        }
    }

    getKeyAction() {
        return this.keypressTab.toKeyAction();
    }

}
