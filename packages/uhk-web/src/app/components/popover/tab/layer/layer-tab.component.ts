import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, Input, OnChanges, SimpleChanges } from '@angular/core';
import { copyRgbColor, KeyAction, LayerName, SwitchLayerAction, SwitchLayerMode, UserConfiguration } from 'uhk-common';

import { Tab } from '../tab';
import { LayerOption } from '../../../../models';
import { RemapInfo } from '../../../../models/remap-info';
import { initLayerOptions } from '../../../../store/reducers/layer-options';

export type toggleType = 'active' | 'toggle';

@Component({
    selector: 'layer-tab',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false,
    templateUrl: './layer-tab.component.html',
    styleUrls: ['./layer-tab.component.scss']
})
export class LayerTabComponent extends Tab implements OnChanges {
    @Input() allowRemapOnAllKeymapWarning: boolean;
    @Input() defaultKeyAction: KeyAction;
    @Input() currentLayer: LayerOption;
    @Input() allowLayerDoubleTap: boolean;
    @Input() layerOptions: LayerOption[] = [];
    @Input() remapInfo: RemapInfo;
    @Input() userConfiguration: UserConfiguration;

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

    layerData: LayerOption[] = [];

    toggle: toggleType;
    layer: LayerName;
    layerDisplayText: string;
    lockLayerWhenDoubleTapping: boolean;
    showWarning= false;

    constructor(private cdRef: ChangeDetectorRef) {
        super();
        this.toggle = 'active';
        this.layer = LayerName.mod;
        this.calculateWarning();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['defaultKeyAction']) {
            this.fromKeyAction(this.defaultKeyAction);
        }

        if (changes['currentLayer']) {
            this.isNotBase = this.currentLayer.id !== LayerName.base;
        }

        if (changes.layerOptions) {
            this.layerData = this.layerOptions.filter(layer => layer.selected && layer.allowed);
        }

        this.calculateWarning();
        this.validAction.emit(!this.isNotBase);
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
        copyRgbColor(this.defaultKeyAction, keyAction);
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
        this.calculateWarning();
    }

    private calculateWarning() {
        if (this.allowRemapOnAllKeymapWarning && this.userConfiguration && this.remapInfo.remapOnAllKeymap) {
            for (const keymap of this.userConfiguration.keymaps) {
                const layer = keymap.layers.find(layer => layer.id === this.layer);
                if (!layer) {
                    this.showWarning = true;

                    const layerOptions = initLayerOptions();
                    const layerOption = layerOptions.get(this.layer);
                    this.layerDisplayText = layerOption?.name;

                    break;
                }
            }
        }
        else {
            this.showWarning = false;
        }
    }

    remapInfoChanged(remapInfo: RemapInfo): void {
        this.remapInfo = remapInfo;
        this.calculateWarning();
        this.cdRef.markForCheck();
    }
}
