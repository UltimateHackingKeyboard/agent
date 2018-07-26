import { ChangeDetectionStrategy, Component, HostBinding, Input, OnChanges, SimpleChanges } from '@angular/core';
import { KeyAction, LayerName, SwitchLayerAction, SwitchLayerMode } from 'uhk-common';

import { Tab } from '../tab';

export type toggleType = 'active' | 'toggle';

@Component({
    selector: 'layer-tab',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './layer-tab.component.html',
    styleUrls: ['./layer-tab.component.scss']
})
export class LayerTabComponent extends Tab implements OnChanges {
    @Input() defaultKeyAction: KeyAction;
    @Input() currentLayer: number;
    @Input() allowLayerDoubleTap: boolean;

    @HostBinding('class.no-base') isNotBase: boolean;

    toggleData: { id: toggleType, text: string }[] = [
        {
            id: 'active',
            text: 'Activate'
        },
        {
            id: 'toggle',
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

    toggle: toggleType;
    layer: LayerName;
    lockLayerWhenDoubleTapping: boolean;

    constructor() {
        super();
        this.toggle = 'active';
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
        switch (switchLayerAction.switchLayerMode) {
            case SwitchLayerMode.holdAndDoubleTapToggle: {
                this.toggle = 'active';
                this.lockLayerWhenDoubleTapping = true;
                break;
            }

            case SwitchLayerMode.hold: {
                this.toggle = 'active';
                this.lockLayerWhenDoubleTapping = false;
                break;
            }

            default: {
                this.toggle = 'toggle';
                this.lockLayerWhenDoubleTapping = false;
            }
        }

        this.layer = switchLayerAction.layer;
        return true;
    }

    toKeyAction(): SwitchLayerAction {
        const keyAction = new SwitchLayerAction();
        if (this.toggle === 'toggle') {
            keyAction.switchLayerMode = SwitchLayerMode.toggle;
        } else if (!this.allowLayerDoubleTap || this.lockLayerWhenDoubleTapping) {
            keyAction.switchLayerMode = SwitchLayerMode.holdAndDoubleTapToggle;
        } else {
            keyAction.switchLayerMode = SwitchLayerMode.hold;
        }

        keyAction.layer = this.layer;
        if (!this.keyActionValid()) {
            throw new Error('KeyAction is invalid!');
        }
        return keyAction;
    }

    toggleChanged(value: toggleType) {
        this.toggle = value;
    }

    layerChanged(value: number) {
        this.layer = +value;
    }
}
