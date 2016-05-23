import { Component, OnInit } from '@angular/core';

import { KeyActionSaver } from '../key-action-saver';
import { KeyAction } from '../../../../config-serializer/config-items/KeyAction';

@Component({
    moduleId: module.id,
    selector: 'macro-tab',
    template:
    `
        Macro
    `
})
export class MacroTabComponent implements OnInit, KeyActionSaver {
    constructor() { }

    ngOnInit() { }

    keyActionValid(): boolean {
        return false;
    }

    toKeyAction(): KeyAction {
        return undefined;
    }

}
