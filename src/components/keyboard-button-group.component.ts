import { Component, OnInit, Input } from 'angular2/core';

import {KeyboardButtonComponent} from './keyboard-button.component';
import {KeyboardButton} from './keyboard-button.model';

@Component({
    selector: 'keyboard-button-group',
    template:
    `
        <keyboard-button *ngFor="#keyboardButton of keyboardButtons"
                            [id]="keyboardButton.id" [fill]="keyboardButton.fill"
                            [rx]="keyboardButton.rx" [ry]="keyboardButton.ry"
                            [height]="keyboardButton.height" [width]="keyboardButton.width">
        </keyboard-button>
    `,
    styles:
    [`
        :host {
            display: flex;
        }

        keyboard-button {
            border: 2px solid transparent;
        }
    `],
    directives: [KeyboardButtonComponent]
})
export class KeyboardButtonGroupComponent implements OnInit {
    @Input() keyboardButtons: KeyboardButton[];
    constructor() { }

    ngOnInit() { }

}
