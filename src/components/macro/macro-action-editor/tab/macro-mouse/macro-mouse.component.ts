import {
    Component, 
    OnInit, 
    Input, 
    Output, 
    EventEmitter, 
    ElementRef, 
    ViewChild
} from '@angular/core';

import {Tab} from '../../../../popover/tab/tab';
import {MacroAction, macroActionType} from '../../../../../../config-serializer/config-items/MacroAction';

import { PressMouseButtonsMacroAction } from '../../../../../../config-serializer/config-items/PressMouseButtonsMacroAction';
import { HoldMouseButtonsMacroAction } from '../../../../../../config-serializer/config-items/HoldMouseButtonsMacroAction';
import { ReleaseMouseButtonsMacroAction } from '../../../../../../config-serializer/config-items/ReleaseMouseButtonsMacroAction';

enum TabName {
    Move,
    Scroll,
    Click,
    Hold,
    Release
}

@Component({
    moduleId: module.id,
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
    private TabName = TabName;
    private buttons: Number[] = [];

    constructor() {
        
    }

    ngOnInit() {
        this.selectTab(this.getTabName(this.macroAction));
    }

    selectTab(tab: TabName): void {
        this.activeTab = tab;
    }

    setMouseClick(id: number) {
        // @ todo set the correct mask
        const action = this.macroAction as PressMouseButtonsMacroAction;
        let idx = this.buttons.indexOf(id)
        if (idx !== -1) {
            // Deselect button
            this.buttons.splice(idx, 1);
        } else {
            this.buttons.push(id);
        }
        action.mouseButtonsMask = id;
    }

    hasButton(id: number) {
        return this.buttons.indexOf(id) !== -1;
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