import { Component, OnInit } from '@angular/core';

import { LayerName, SwitchLayerAction } from '../../../../config-serializer/config-items/SwitchLayerAction';
import { KeyActionSaver } from '../key-action-saver';

@Component({
    moduleId: module.id,
    selector: 'layer-tab',
    template:
    `
        <select [(ngModel)]="toggle">
            <option [ngValue]="false"> Activate </option>
            <option [ngValue]="true"> Toggle </option>
        </select>
        <span>the</span>
        <select [(ngModel)]="layer">
            <option [ngValue]="0"> Mod </option>
            <option [ngValue]="1"> Fn </option>
            <option [ngValue]="2"> Mouse </option>
        </select>
        <span>
        layer by holding this key.
        </span>
    `,
    styles: [require('./layer-tab.component.scss')]
})
export class LayerTabComponent implements OnInit, KeyActionSaver {
    private toggle: boolean;
    private layer: LayerName;

    constructor() {
        this.toggle = false;
        this.layer = LayerName.mod;
    }

    ngOnInit() { }

    keyActionValid(): boolean {
        return true;
    }

    toKeyAction(): SwitchLayerAction {
        let keyAction = new SwitchLayerAction();
        keyAction.isLayerToggleable = this.toggle;
        keyAction.layer = this.layer;
        return keyAction;
    }

}
