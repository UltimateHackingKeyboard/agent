import {
    Component,
    OnInit,
    Input,
    ViewChild
} from '@angular/core';

import {Tab} from '../../../../popover/tab/tab';
import {MacroAction, macroActionType} from '../../../../../config-serializer/config-items/MacroAction';

import { PressKeyMacroAction } from '../../../../../config-serializer/config-items/PressKeyMacroAction';
import { HoldKeyMacroAction } from '../../../../../config-serializer/config-items/HoldKeyMacroAction';
import { ReleaseKeyMacroAction } from '../../../../../config-serializer/config-items/ReleaseKeyMacroAction';

import {KeypressTabComponent} from '../../../../popover/tab/keypress/keypress-tab.component';

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
    @Input() macroAction: MacroAction;
    @ViewChild('tab') selectedTab: Tab;

    private activeTab: TabName;
    private tabName = TabName;

    constructor() {}

    ngOnInit() {
        this.selectTab(this.getTabName(this.macroAction));
    }

    selectTab(tab: TabName): void {
        this.activeTab = tab;
    }

    getActionType(action: MacroAction) {
        const data = action.toJsObject();
        return data.macroActionType;
    }

    getTabName(action: MacroAction) {
        const actionType = this.getActionType(action);

        switch (actionType) {
            // Press mouse buttons
            case macroActionType.PressKeyMacroAction:
                return TabName.Keypress;
            // Hold mouse buttons
            case macroActionType.HoldKeyMacroAction:
                return TabName.Hold;
            // Release mouse buttons
            case macroActionType.ReleaseKeyMacroAction:
                return TabName.Release;

            default:
                return TabName.Keypress;
        }
    }

}
