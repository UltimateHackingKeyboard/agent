import { Component, OnInit } from '@angular/core';

import { KeyActionSaver } from '../key-action-saver';
import { NoneAction } from '../../../../config-serializer/config-items/NoneAction';

@Component({
    moduleId: module.id,
    selector: 'none-tab',
    template: `This key is unassigned and has no functionality.`,
    styles:
    [`
        :host {
            display: flex;
            justify-content: center;
            padding: 2rem 0;
        }
    `]
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
