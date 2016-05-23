import { Component, OnInit } from '@angular/core';

import { KeyActionSaver } from '../key-action-saver';
import { KeyAction } from '../../../../config-serializer/config-items/KeyAction';

@Component({
    moduleId: module.id,
    selector: 'mouse-tab',
    template:
    `
        <div class="mouse-action">
            <ul class="nav nav-pills nav-stacked">
                <li><a>     Move    </a></li>
                <li><a>     Scroll  </a></li>
                <li><a>     Click   </a></li>
                <li><a>     Speed   </a></li>
            </ul>
        </div>
        <div class="details">
        </div>
    `,
    styles: [require('./mouse-tab.component.scss')]
})
export class MouseTabComponent implements OnInit, KeyActionSaver {
    constructor() { }

    ngOnInit() { }

    keyActionValid(): boolean {
        return false;
    }

    toKeyAction(): KeyAction {
        return undefined;
    }

}
