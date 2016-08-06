import {Component, OnInit } from '@angular/core';

import {Tab} from '../tab';
import {KeyAction} from '../../../../../config-serializer/config-items/KeyAction';
import {NoneAction} from '../../../../../config-serializer/config-items/NoneAction';

@Component({
    moduleId: module.id,
    selector: 'none-tab',
    template: require('./none-tab.component.html'),
    styles: [require('./none-tab.component.scss')]
})
export class NoneTabComponent implements OnInit, Tab {
    constructor() { }

    ngOnInit() { }

    keyActionValid(): boolean {
        return true;
    }

    fromKeyAction(keyAction: KeyAction): boolean {
        return false;
    }

    toKeyAction(): NoneAction {
        return new NoneAction();
    }

}
