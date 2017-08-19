import { Component, HostBinding, Input, OnChanges, SimpleChanges } from '@angular/core';

import { KeyAction, LayerName, SwitchLayerAction } from '../../../../config-serializer/config-items/key-action';

import { Tab } from '../tab';

@Component({
    selector: 'layer-tab',
    templateUrl: './layer-tab.component.html',
    styleUrls: ['./layer-tab.component.scss']
})
export class LayerTabComponent extends Tab implements OnChanges {
    @Input() defaultKeyAction: KeyAction;
    @Input() currentLayer: number;

    @HostBinding('class.no-base') isNotBase: boolean;

    toggleData: { id: boolean, text: string }[] = [
        {
            id: false,
            text: 'Activate'
        },
        {
            id: true,
            text: 'Toggle'
        }
    ];

    layerData: { id: number, text: string }[] = [
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

    toggle: boolean;
    layer: LayerName;

    constructor() {
        super();
        this.toggle = false;
        this.layer = LayerName.mod;
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['defaultKeyAction']) {
            this.fromKeyAction(this.defaultKeyAction);
        }

        if (changes['currentLayer']) {
            this.isNotBase = this.currentLayer > 0;
        }

        this.validAction.emit(true);
    }

    keyActionValid(): boolean {
        return !this.isNotBase;
    }

    fromKeyAction(keyAction: KeyAction): boolean {
        if (!(keyAction instanceof SwitchLayerAction)) {
            return false;
        }

        const switchLayerAction: SwitchLayerAction = <SwitchLayerAction>keyAction;
        this.toggle = switchLayerAction.isLayerToggleable;
        this.layer = switchLayerAction.layer;
        return true;
    }

    toKeyAction(): SwitchLayerAction {
        const keyAction = new SwitchLayerAction();
        keyAction.isLayerToggleable = this.toggle;
        keyAction.layer = this.layer;
        if (!this.keyActionValid()) {
            throw new Error('KeyAction is invalid!');
        }
        return keyAction;
    }

    toggleChanged(value: string) {
        this.toggle = value === 'true';
    }

    layerChanged(value: number) {
        this.layer = +value;
    }
}
