import {
    Component,
    OnInit,
    Input,
    ViewChild
} from '@angular/core';

import {Tab} from '../../../../popover/tab/tab';
import {MacroAction, macroActionType} from '../../../../../config-serializer/config-items/MacroAction';

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
    /* tslint:disable:variable-name: It is an enum type. So it can start with uppercase. */
    /* tslint:disable:no-unused-variable: It is used in the template. */
    private TabName = TabName;
    /* tslint:enable:no-unused-variable */
    /* tslint:enable:variable-name */

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
