import { Component, OnInit, Input} from 'angular2/core';

import {KeyboardKey} from './keyboard-key.model';
import {KeyboardKeyComponent} from './keyboard-key.component';

@Component({
    selector: 'g[uhk-module]',
    template:
    `
        <svg:path *ngFor="#path of coverages" [attr.d]="path.$.d"/>
        <svg:g uhk-keyboard-key *ngFor="#key of keyboardKeys"
                [id]="key.id" [fill]="key.fill"
                [rx]="key.rx" [ry]="key.ry"
                [width]="key.width" [height]="key.height"
                [attr.transform]="'translate(' + key.x + ' ' + key.y + ')'"
        />
    `,
    directives: [KeyboardKeyComponent]
})
export class ModuleComponent implements OnInit {
    @Input() coverages: any[];
    @Input() keyboardKeys: KeyboardKey[];
    @Input() fill: string;

    constructor() {
        this.keyboardKeys = [];
    }

    ngOnInit() {

    }

}
