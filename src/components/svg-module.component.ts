import { Component, OnInit, OnChanges, Input, SimpleChange} from 'angular2/core';

import {SvgKeyboardKey} from './svg-keyboard-key.model';
import {SvgKeyboardKeyComponent} from './svg-keyboard-key.component';
import {KeyAction} from '../../config-serializer/config-items/KeyAction';
import {KeystrokeAction} from '../../config-serializer/config-items/KeystrokeAction';
import {Mapper} from '../utils/mapper';

@Component({
    selector: 'g[svg-module]',
    template:
    `
        <svg:path *ngFor="#path of coverages" [attr.d]="path.$.d"/>
        <svg:g svg-keyboard-key *ngFor="#key of keyboardKeys; #i = index"
                [id]="key.id"
                [rx]="key.rx" [ry]="key.ry"
                [width]="key.width" [height]="key.height"
                [attr.transform]="'translate(' + key.x + ' ' + key.y + ')'"
                [asciiCode]="asciiCodes[i]"
        />
    `,
    directives: [SvgKeyboardKeyComponent]
})
export class SvgModuleComponent implements OnInit, OnChanges {
    @Input() coverages: any[];
    @Input() keyboardKeys: SvgKeyboardKey[];
    @Input() keyActions: KeyAction[];
    private asciiCodes: string[][];

    constructor() {
        this.keyboardKeys = [];
        this.asciiCodes = [];
    }

    ngOnInit() {
        this.setAsciiCodes();
        console.log(this);
    }

    ngOnChanges(changes: { [propertyName: string]: SimpleChange }) {
        /* tslint:disable:no-string-literal */
        if (changes['keyActions']) {
            this.setAsciiCodes();
        }
        /* tslint:enable:no-string-literal */

    }

    private setAsciiCodes(): void {
        if (!this.keyActions) {
            return;
        }
        let newAsciiCodes: string[][] = [];
        this.keyActions.forEach((keyAction: KeyAction) => {
            if (keyAction instanceof KeystrokeAction) {
                newAsciiCodes.push(Mapper.scanCodeToText((keyAction as KeystrokeAction).scancode));
            } else {
                newAsciiCodes.push([]);
            }
        });
        this.asciiCodes = newAsciiCodes;
    }

}
