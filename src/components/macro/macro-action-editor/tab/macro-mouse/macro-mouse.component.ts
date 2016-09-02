import {
    Component,
    OnInit,
    Input,
    ViewChild
} from '@angular/core';

import {Tab} from '../../../../popover/tab/tab';
import {MacroAction, macroActionType} from '../../../../../config-serializer/config-items/MacroAction';

import { PressMouseButtonsMacroAction } from '../../../../../config-serializer/config-items/PressMouseButtonsMacroAction';

enum TabName {
    Move,
    Scroll,
    Click,
    Hold,
    Release
}

@Component({
    selector: 'macro-mouse-tab',
    template: require('./macro-mouse.component.html'),
    styles: [
        require('../../macro-action-editor.component.scss'),
        require('./macro-mouse.component.scss')
    ],
    host: { 'class': 'macro__mouse' }
})
export class MacroMouseTabComponent implements OnInit {
    @Input() macroAction: MacroAction;
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
    }

    selectTab(tab: TabName): void {
        this.activeTab = tab;
    }

    setMouseClick(index: number) {
        // @ todo set the correct mask
        this.selectedButtons[index] = !this.selectedButtons[index];
    }

    hasButton(index: number) {
        return this.selectedButtons[index];
    }
    }

    getActionType(action: MacroAction) {
        const data = action.toJsObject();
        return data.macroActionType;
    }

    getTabName(action: MacroAction) {
        const actionType = this.getActionType(action);

        switch (actionType) {
            // Press mouse buttons
            case macroActionType.PressMouseButtonsMacroAction:
                return TabName.Click;
            // Hold mouse buttons
            case macroActionType.HoldMouseButtonsMacroAction:
                return TabName.Hold;
            // Release mouse buttons
            case macroActionType.ReleaseMouseButtonsMacroAction:
                return TabName.Release;
            // Move mouse cursor
            case macroActionType.MoveMouseMacroAction:
                return TabName.Move;
            case macroActionType.ScrollMouseMacroAction:
                return TabName.Scroll;
            default:
                return TabName.Move;
        }
    }

}
