import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { faArrowsAlt, faArrowsAltV, faHandPaper, faHandRock, faMousePointer } from '@fortawesome/free-solid-svg-icons';

import {
    INT16_MAX,
    INT16_MIN,
    MacroMouseSubAction,
    MouseButtons,
    MouseButtonMacroAction,
    MoveMouseMacroAction,
    ScrollMouseMacroAction
} from 'uhk-common';
import { MacroBaseComponent } from '../macro-base.component';

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
    standalone: false,
    templateUrl: './macro-mouse.component.html',
    styleUrls: [
        '../../macro-action-editor.component.scss',
        './macro-mouse.component.scss'
    ],
    host: {'class': 'macro__mouse'}
})
export class MacroMouseTabComponent extends MacroBaseComponent implements OnInit, OnChanges {
    @Input() macroAction: MouseMacroAction;

    INT16_MAX = INT16_MAX;
    INT16_MIN = INT16_MIN;
    MouseButtons = MouseButtons;
    TabName = TabName;
    activeTab: TabName;
    buttonLabels: string[];
    faArrowsAlt = faArrowsAlt;
    faArrowsAltV = faArrowsAltV;
    faHandPaper = faHandPaper;
    faHandRock = faHandRock;
    faMousePointer = faMousePointer;
    private selectedButtons: boolean[];

    constructor() {
        super();
        this.buttonLabels = ['Left', 'Middle', 'Right'];
        this.selectedButtons = Array(this.buttonLabels.length).fill(false);
    }

    ngOnInit() {
        if (!this.macroAction) {
            this.macroAction = new MouseButtonMacroAction();
            this.macroAction.action = MacroMouseSubAction.click;
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
        } else {
            this.selectedButtons = [];
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
        this.validate();
    }

    setMouseClick(index: number): void {
        this.selectedButtons[index] = !this.selectedButtons[index];
        (<MouseButtonMacroAction>this.macroAction).setMouseButtons(this.selectedButtons);
        this.validate();
    }

    hasButton(index: number): boolean {
        return this.selectedButtons[index];
    }

    getAction(tab: TabName): MacroMouseSubAction {
        switch (tab) {
            case TabName.Click:
                return MacroMouseSubAction.click;
            case TabName.Hold:
                return MacroMouseSubAction.hold;
            case TabName.Release:
                return MacroMouseSubAction.release;
            default:
                throw new Error(`Invalid tab name: ${TabName[tab]}`);
        }
    }

    setCoordinate(axis: 'x' | 'y', value: number | string): void {
        const numericValue = Number(value);
        if (Number.isNaN(numericValue)) {
            return;
        }

        const action = this.macroAction as MoveMouseMacroAction | ScrollMouseMacroAction;
        action[axis] = Math.min(Math.max(Math.round(numericValue), INT16_MIN), INT16_MAX);
        this.validate();
    }

    getTabName(action: MouseMacroAction): TabName {
        if (action instanceof MouseButtonMacroAction) {
            if (!action.action || action.isOnlyClickAction()) {
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

    isMacroValid = () => {
        switch (this.macroAction.constructor) {
            case MoveMouseMacroAction:
            case ScrollMouseMacroAction: {
                const { x, y } = this.macroAction as MoveMouseMacroAction;
                return x !== undefined && x !== null && y !== undefined && y !== null &&
                    (x !== 0 || y !== 0) &&
                    x >= INT16_MIN && x <= INT16_MAX &&
                    y >= INT16_MIN && y <= INT16_MAX;
            }

            case MouseButtonMacroAction: {
                const { mouseButtonsMask } = this.macroAction as MouseButtonMacroAction;
                return !!mouseButtonsMask;
            }

            default:
                return true;
        }
    };
}
