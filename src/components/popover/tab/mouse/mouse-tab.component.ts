import {KeyAction, MouseAction, MouseActionParam} from '../../../../config-serializer/config-items/key-action';
import {Tab} from '../tab';
import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'mouse-tab',
    template: require('./mouse-tab.component.html'),
    styles: [require('./mouse-tab.component.scss')]
})
export class MouseTabComponent implements OnInit, Tab {
    @Input() defaultKeyAction: KeyAction;

    private mouseActionParam: MouseActionParam;
    private selectedPageIndex: number;
    /* tslint:disable:variable-name: It is an enum type. So it can start with uppercase. */
    /* tslint:disable:no-unused-variable: It is used in the template. */
    private MouseActionParam = MouseActionParam;
    /* tslint:enable:no-unused-variable tslint:enable:variable-name */

    private pages: string[];

    constructor() {
        this.selectedPageIndex = 0;
        this.pages = ['Move', 'Scroll', 'Click', 'Speed'];
    }

    ngOnInit() {
        this.fromKeyAction(this.defaultKeyAction);
    }

    keyActionValid(): boolean {
        return this.mouseActionParam !== undefined;
    }

    fromKeyAction(keyAction: KeyAction): boolean {
        if (!(keyAction instanceof MouseAction)) {
            return false;
        }
        let mouseAction: MouseAction = <MouseAction>keyAction;
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
        if (!this.keyActionValid()) {
            throw new Error('KeyAction is not valid. No selected mouse action!');
        }
        let mouseAction: MouseAction = new MouseAction();
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
    }

    setMouseActionParam(mouseActionParam: MouseActionParam) {
        this.mouseActionParam = mouseActionParam;
    }

}
