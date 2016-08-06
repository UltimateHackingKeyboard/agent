import {Component, OnInit, Input, ViewChild} from '@angular/core';
import {NgSwitch, NgSwitchCase, NgSwitchDefault} from '@angular/common';

import {LayerName, SwitchLayerAction} from '../../../../../config-serializer/config-items/SwitchLayerAction';
import {KeyAction} from '../../../../../config-serializer/config-items/KeyAction';

import {Select2Component} from 'ng2-select2/dist/select2/select2.component';
import {OptionData} from 'ng2-select2/dist/select2';

import {Tab} from '../tab';

@Component({
    moduleId: module.id,
    selector: 'layer-tab',
    template: require('./layer-tab.component.html'),
    styles: [require('./layer-tab.component.scss')],
    directives: [Select2Component, NgSwitch, NgSwitchCase, NgSwitchDefault]
})
export class LayerTabComponent implements OnInit, Tab {
    @Input() defaultKeyAction: KeyAction;
    @ViewChild('toggleSelect') toggleSelect2: Select2Component;
    @ViewChild('layerSelect') layerSelect2: Select2Component;

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

    ngOnInit() {
        this.fromKeyAction(this.defaultKeyAction);
    }

    keyActionValid(): boolean {
        return true;
    }

    fromKeyAction(keyAction: KeyAction): boolean {
        if (!(keyAction instanceof SwitchLayerAction)) {
            return false;
        }
        let switchLayerAction: SwitchLayerAction = <SwitchLayerAction>keyAction;
        this.toggle = switchLayerAction.isLayerToggleable;
        this.layer = switchLayerAction.layer;
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
