import { Component, OnInit, Input} from 'angular2/core';

import {SvgKeyboardKey} from './svg-keyboard-key.model';
import {SvgKeyboardKeyComponent} from './svg-keyboard-key.component';

@Component({
    selector: 'g[svg-module]',
    template:
    `
        <svg:path *ngFor="#path of coverages" [attr.d]="path.$.d"/>
        <svg:g svg-keyboard-key *ngFor="#key of keyboardKeys"
                [id]="key.id"
                [rx]="key.rx" [ry]="key.ry"
                [width]="key.width" [height]="key.height"
                [attr.transform]="'translate(' + key.x + ' ' + key.y + ')'"
        />
    `,
    directives: [SvgKeyboardKeyComponent]
})
export class SvgModuleComponent implements OnInit {
    @Input() coverages: any[];
    @Input() keyboardKeys: SvgKeyboardKey[];

    constructor() {
        this.keyboardKeys = [];
    }

    ngOnInit() {

    }

}
