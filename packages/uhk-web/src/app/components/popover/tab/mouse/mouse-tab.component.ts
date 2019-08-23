import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { KeyAction, MouseAction, MouseActionParam } from 'uhk-common';

import { Tab } from '../tab';

@Component({
    selector: 'mouse-tab',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './mouse-tab.component.html',
    styleUrls: ['./mouse-tab.component.scss']
})
export class MouseTabComponent extends Tab implements OnChanges {
    @Input() defaultKeyAction: KeyAction;
    @Input() extraMouseButtonsSupported: boolean;

    /* tslint:disable:variable-name: It is an enum type. So it can start with uppercase. */
    MouseActionParam = MouseActionParam;
    /* tslint:enable:variable-name*/
    mouseActionParam: MouseActionParam;
    selectedPageIndex: number;
    pages: string[];

    constructor() {
        super();
        this.selectedPageIndex = 0;
        this.pages = ['Move', 'Scroll', 'Click', 'Speed'];
    }

    ngOnChanges() {
        this.fromKeyAction(this.defaultKeyAction);
        this.validAction.emit(this.keyActionValid());
    }

    keyActionValid(): boolean {
        return this.mouseActionParam !== undefined;
    }

    fromKeyAction(keyAction: KeyAction): boolean {
        if (!(keyAction instanceof MouseAction)) {
            return false;
        }

        const mouseAction: MouseAction = <MouseAction>keyAction;
        this.mouseActionParam = mouseAction.mouseAction;

        if (mouseAction.mouseAction === MouseActionParam.moveUp) {
            this.selectedPageIndex = 0;
        }

        switch (mouseAction.mouseAction) {
            case MouseActionParam.moveDown:
            case MouseActionParam.moveUp:
            case MouseActionParam.moveLeft:
            case MouseActionParam.moveRight:
                this.selectedPageIndex = 0;
                break;
            case MouseActionParam.scrollDown:
            case MouseActionParam.scrollUp:
            case MouseActionParam.scrollLeft:
            case MouseActionParam.scrollRight:
                this.selectedPageIndex = 1;
                break;
            case MouseActionParam.leftClick:
            case MouseActionParam.middleClick:
            case MouseActionParam.rightClick:
            case MouseActionParam.button4:
            case MouseActionParam.button5:
            case MouseActionParam.button6:
            case MouseActionParam.button7:
            case MouseActionParam.button8:
                this.selectedPageIndex = 2;
                break;
            case MouseActionParam.decelerate:
            case MouseActionParam.accelerate:
                this.selectedPageIndex = 3;
                break;
            default:
                return false;
        }

        return true;
    }

    toKeyAction(): MouseAction {
        const mouseAction: MouseAction = new MouseAction();
        mouseAction.mouseAction = this.mouseActionParam;
        return mouseAction;
    }

    changePage(index: number) {
        if (index < -1 || index > 3) {
            console.error(`Invalid index error: ${index}`);
            return;
        }

        this.selectedPageIndex = index;
        this.mouseActionParam = undefined;
        this.validAction.emit(false);
    }

    setMouseActionParam(mouseActionParam: MouseActionParam) {
        this.mouseActionParam = mouseActionParam;
        this.validAction.emit(true);
    }
}
