import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import {SvgKeyboardKey} from './svg-keyboard-key.model';
import {SvgKeyboardKeyComponent} from './svg-keyboard-key.component';
import {KeyAction} from '../../config-serializer/config-items/KeyAction';

@Component({
    selector: 'g[svg-module]',
    template:
    `
        <svg:path *ngFor="let path of coverages" [attr.d]="path.$.d"/>
        <svg:g svg-keyboard-key *ngFor="let key of keyboardKeys; let i = index"
                [id]="key.id"
                [rx]="key.rx" [ry]="key.ry"
                [width]="key.width" [height]="key.height"
                [attr.transform]="'translate(' + key.x + ' ' + key.y + ')'"
                [keyAction]="keyActions[i]"
                (click)="onKeyClick(i)"
        />
        <popover *ngIf="popOverEnabled"></popover>
    `,
    styles:
    [`
        :host {
            position: relative;
        }
    `],
    directives: [SvgKeyboardKeyComponent]
})
export class SvgModuleComponent implements OnInit {
    @Input() coverages: any[];
    @Input() keyboardKeys: SvgKeyboardKey[];
    @Input() keyActions: KeyAction[];
    @Output() editKeyActionRequest = new EventEmitter<number>();

    constructor() {
        this.keyboardKeys = [];
    }

    ngOnInit() { }

    onKeyClick(index: number): void {
        this.editKeyActionRequest.emit(index);
    }

}
