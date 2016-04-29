import { Component, OnInit, OnChanges, Input, SimpleChange} from 'angular2/core';

import {SvgKeyboardKey} from './svg-keyboard-key.model';
import {SvgKeyboardKeyComponent} from './svg-keyboard-key.component';
import {KeyAction} from '../../config-serializer/config-items/KeyAction';
import {KeystrokeAction} from '../../config-serializer/config-items/KeystrokeAction';
import {KeystrokeModifiersAction, KeyModifiers} from '../../config-serializer/config-items/KeystrokeModifiersAction';
import {SwitchLayerAction, LayerName}  from '../../config-serializer/config-items/SwitchLayerAction';
import {Mapper} from '../utils/mapper';

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
                [labels]="labels[i]"
        />
    `,
    directives: [SvgKeyboardKeyComponent]
})
export class SvgModuleComponent implements OnInit, OnChanges {
    @Input() coverages: any[];
    @Input() keyboardKeys: SvgKeyboardKey[];
    @Input() keyActions: KeyAction[];
    private labels: string[][];

    constructor() {
        this.keyboardKeys = [];
        this.labels = [];
    }

    ngOnInit() {
        this.setLabels();
        console.log(this);
    }

    ngOnChanges(changes: { [propertyName: string]: SimpleChange }) {
        /* tslint:disable:no-string-literal */
        if (changes['keyActions']) {
            this.setLabels();
        }
        /* tslint:enable:no-string-literal */

    }

    private setLabels(): void {
        if (!this.keyActions) {
            return;
        }
        let newLabels: string[][] = [];
        this.keyActions.forEach((keyAction: KeyAction) => {
            if (keyAction instanceof KeystrokeModifiersAction) {
                if (keyAction.isOnlyOneModifierActive()) {
                    switch (keyAction.modifierMask) {
                        case KeyModifiers.leftCtrl:
                        case KeyModifiers.rightCtrl:
                            newLabels.push(['Ctrl']);
                            break;
                        case KeyModifiers.leftShift:
                        case KeyModifiers.rightShift:
                            newLabels.push(['Shift']);
                            break;
                        case KeyModifiers.leftAlt:
                        case KeyModifiers.rightAlt:
                            newLabels.push(['Alt']);
                            break;
                        case KeyModifiers.leftGui:
                        case KeyModifiers.rightGui:
                            newLabels.push(['Super']);
                            break;
                        default:
                            newLabels.push(['Undefined']);
                            break;
                    }
                }
            } else if (keyAction instanceof KeystrokeAction) {
                newLabels.push(Mapper.scanCodeToText((keyAction as KeystrokeAction).scancode));
            } else if (keyAction instanceof SwitchLayerAction) {
                switch (keyAction.layer) {
                    case LayerName.mod:
                        newLabels.push(['Mod']);
                        break;
                    case LayerName.fn:
                        newLabels.push(['Fn']);
                        break;
                    case LayerName.mouse:
                        newLabels.push(['Mouse']);
                        break;
                    default:
                        break;
                }
            } else {
                newLabels.push([]);
            }
        });
        this.labels = newLabels;
    }

}
