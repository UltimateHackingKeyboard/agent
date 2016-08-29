import { Component, Input, OnChanges, ViewChild } from '@angular/core';

import { KeyAction, LayerName, SwitchLayerAction } from '../../../../config-serializer/config-items/key-action';

import { Select2Component, Select2OptionData } from 'ng2-select2/ng2-select2';

import { Tab } from '../tab';

@Component({
    selector: 'layer-tab',
    template: require('./layer-tab.component.html'),
    styles: [require('./layer-tab.component.scss')]
})
export class LayerTabComponent implements OnChanges, Tab {
    @Input() defaultKeyAction: KeyAction;

    private toggle: boolean;
    private layer: LayerName;

    /* tslint:disable:no-unused-variable: They're used in the template */
    private toggleData: {id: boolean, text: string}[] = [
        {
            id: false,
            text: 'Activate'
        },
        {
            id: true,
            text: 'Toggle'
        }
    ];

    private layerData: {id: number, text: string}[] = [
        {
            id: 0,
            text: 'Mod'
        },
        {
            id: 1,
            text: 'Fn'
        },
        {
            id: 2,
            text: 'Mouse'
        }
    ];
    /* tslint:enable:no-unused-variable */

    constructor() {
        this.toggle = false;
        this.layer = LayerName.mod;
    }

    ngOnChanges() {
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

    toggleChanged(value: boolean) {
        this.toggle = value;
    }

    layerChanged(value: number) {
        this.layer = value;
    }
}
