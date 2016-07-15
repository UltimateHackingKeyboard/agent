import { Component, OnInit } from '@angular/core';

import {NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';

import { LayerName, SwitchLayerAction } from '../../../../../config-serializer/config-items/SwitchLayerAction';
import { KeyActionSaver } from '../../key-action-saver';

import {SELECT2_DIRECTIVES} from 'ng2-select2/dist/ng2-select2';
import {OptionData} from 'ng2-select2/dist/select2';

@Component({
    moduleId: module.id,
    selector: 'layer-tab',
    template: require('./layer-tab.component.html'),
    styles: [require('./layer-tab.component.scss')],
    directives: [SELECT2_DIRECTIVES, NgSwitch, NgSwitchCase, NgSwitchDefault]
})
export class LayerTabComponent implements OnInit, KeyActionSaver {
    private toggle: boolean;
    private layer: LayerName;

    private toggleData: Array<OptionData> = [
        {
            id: 'false',
            text: 'Activate'
        },
        {
            id: 'true',
            text: 'Toggle'
        }
    ];

    private layerData: Array<OptionData> = [
        {
            id: '0',
            text: 'Mod'
        },
        {
            id: '1',
            text: 'Fn'
        },
        {
            id: '2',
            text: 'Mouse'
        }
    ];

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

    // TODO: change to the correct type when the wrapper has added it.
    private toggleChanged(event: any) {
        this.toggle = event.value;
    }

    // TODO: change to the correct type when the wrapper has added it.
    private layerChanged(event: any) {
        this.layer = +event.value;
    }
}
