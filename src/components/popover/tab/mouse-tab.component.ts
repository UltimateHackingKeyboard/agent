import { Component, OnInit, Renderer} from '@angular/core';
import {NgSwitch, NgSwitchCase, NgSwitchDefault} from '@angular/common';

import { KeyActionSaver } from '../key-action-saver';
import {MouseAction, MouseActionParam} from '../../../../config-serializer/config-items/MouseAction';

@Component({
    moduleId: module.id,
    selector: 'mouse-tab',
    template: require('./mouse-tab.component.html'),
    styles: [require('./mouse-tab.component.scss')],
    directives: [NgSwitch, NgSwitchCase, NgSwitchDefault]
})
export class MouseTabComponent implements OnInit, KeyActionSaver {
    private mouseActionParam: MouseActionParam;
    private selectedIndex: number;
    private selectedButton: HTMLButtonElement;
    private MouseActionParam = MouseActionParam;

    constructor(private renderer: Renderer) {
        this.selectedIndex = 0;
    }

    ngOnInit() { }

    keyActionValid(): boolean {
        return !!this.mouseActionParam;
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
        this.selectedIndex = index;
        this.mouseActionParam = undefined;
        this.selectedButton = undefined;
    }

    onMouseActionClick(target: HTMLButtonElement, mouseActionParam: MouseActionParam) {
        if (this.selectedButton) {
            this.renderer.setElementClass(this.selectedButton, 'btn-primary', false);
        }
        this.selectedButton = target;
        this.renderer.setElementClass(target, 'btn-primary', true);
        this.mouseActionParam = mouseActionParam;
    }

}
