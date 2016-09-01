import {Component, OnInit } from '@angular/core';

import {NoneAction} from '../../../../config-serializer/config-items/NoneAction';
import {Tab} from '../tab';

@Component({
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

    fromKeyAction(): boolean {
        return false;
    }

    toKeyAction(): NoneAction {
        return new NoneAction();
    }

}
