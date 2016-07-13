import { Component, OnInit } from '@angular/core';

import { KeyActionSaver } from '../key-action-saver';
import { NoneAction } from '../../../../config-serializer/config-items/NoneAction';

@Component({
    moduleId: module.id,
    selector: 'none-tab',
    template: require('./none-tab.component.html'),
    styles: [require('./none-tab.component.scss')]
})
export class NoneTabComponent implements OnInit, KeyActionSaver {
    constructor() { }

    ngOnInit() { }

    keyActionValid(): boolean {
        return true;
    }

    toKeyAction(): NoneAction {
        return new NoneAction();
    }

}
