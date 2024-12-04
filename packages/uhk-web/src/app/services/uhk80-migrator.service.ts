import { Injectable, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import {
    KeyActionHelper,
    Layer,
    LayerName,
    NoneAction,
    UHK_60_LEFT_MAX_KEY_ACTION_COUNT,
    UHK_60_RIGHT_MAX_KEY_ACTION_COUNT,
    UHK_80_DEVICE,
    UhkDeviceProduct,
    UserConfiguration,
} from 'uhk-common';

import { AppState, getConnectedDevice, getPlatform } from '../store/index';

import { DefaultUserConfigurationService } from './default-user-configuration.service';

@Injectable({ providedIn: 'root' })
export class Uhk80MigratorService implements OnDestroy {
    private connectedDevice: UhkDeviceProduct;
    private platform: string;
    private subscriptions = new Subscription();

    constructor(
        private defaultUserConfigurationService: DefaultUserConfigurationService,
        private store: Store<AppState>,
    ) {
        this.subscriptions.add(this.store.select(getConnectedDevice).subscribe(device => {
            this.connectedDevice = device;
        }));
        this.subscriptions.add(this.store.select(getPlatform).subscribe(platform => {
            this.platform = platform;
        }));
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public migrate(userConfig: UserConfiguration): UserConfiguration {
        if (this.connectedDevice?.id !== UHK_80_DEVICE.id) {
            return userConfig;
        }

        let hasConfiguredExcessKey = this.hasUhk80ConfiguredExcessKey(userConfig);

        if (hasConfiguredExcessKey) {
            return userConfig;
        }

        const uhk80UserConfig = this.defaultUserConfigurationService.getDefault80().clone();
        let uhk80BaseLayerPc: Layer;
        let uhk80BaseLayerMac: Layer;
        let uhk80Fn2Layer: Layer;

        for (const keymap of uhk80UserConfig.keymaps) {
            for (const layer of keymap.layers) {
                if (layer.id === LayerName.base) {
                    if (keymap.abbreviation === 'QWM') {
                        uhk80BaseLayerMac = layer;
                    }
                    else if (keymap.abbreviation === 'QWR') {
                        uhk80BaseLayerPc = layer;
                    }
                }

                if (!uhk80Fn2Layer && layer.id === LayerName.fn2) {
                    uhk80Fn2Layer = layer;
                }
            }

            if (uhk80BaseLayerPc && uhk80BaseLayerMac && uhk80Fn2Layer) {
                break;
            }
        }

        for (const keymap of userConfig.keymaps) {
            const keymapName = keymap.name.toUpperCase();
            const keymapNameIncludePC = keymapName.includes('PC');
            const keymapNameIncludeMac = keymapName.includes('MAC');
            let hasFn2Layer = false;

            for (const layer of keymap.layers) {
                if (layer.id === LayerName.base) {
                    if (keymap.abbreviation === 'QWR' || keymap.name === 'QWERTY for PC') {
                        this.extendUhk60LayerWith80Layer(layer, uhk80BaseLayerPc);
                    }
                    else if(keymap.abbreviation === 'QWM' || keymap.name === 'QWERTY for Mac') {
                        this.extendUhk60LayerWith80Layer(layer, uhk80BaseLayerMac);
                    }
                    else if (keymapNameIncludePC && !keymapNameIncludeMac) {
                        this.extendUhk60LayerWith80Layer(layer, uhk80BaseLayerPc);
                    }
                    else if (!keymapNameIncludePC && keymapNameIncludeMac) {
                        this.extendUhk60LayerWith80Layer(layer, uhk80BaseLayerMac);
                    }
                    else if (keymapNameIncludePC) {
                        this.extendUhk60LayerWith80Layer(layer, uhk80BaseLayerPc);
                    }
                    else if (keymapNameIncludeMac) {
                        this.extendUhk60LayerWith80Layer(layer, uhk80BaseLayerMac);
                    }
                    else if (this.platform === 'darwin') {
                        this.extendUhk60LayerWith80Layer(layer, uhk80BaseLayerMac);
                    }
                    else {
                        this.extendUhk60LayerWith80Layer(layer, uhk80BaseLayerMac);
                    }
                }
                else if (layer.id === LayerName.fn2) {
                    hasFn2Layer = true;
                    this.extendUhk60LayerWith80Layer(layer, uhk80Fn2Layer);
                }
                else {
                    this.extendUhk60LayerWithNoneActions(layer, uhk80BaseLayerPc);
                }
            }

            if (!hasFn2Layer) {
                keymap.layers.push(new Layer(uhk80Fn2Layer));
            }
        }

        return userConfig;
    }

    private extendUhk60LayerWith80Layer(uhk60Layer: Layer, uhk80Layer: Layer) {
        for (const module of uhk60Layer.modules) {
            const uhk80Module = uhk80Layer.modules.find(x => x.id === module.id);

            // right and left halves
            if (module.id === 0 || module.id === 1) {
                let i = module.id === 0
                    ? UHK_60_RIGHT_MAX_KEY_ACTION_COUNT
                    : UHK_60_LEFT_MAX_KEY_ACTION_COUNT;

                for (; i < uhk80Module.keyActions.length; i++) {
                    const keyAction = uhk80Module.keyActions[i];
                    module.keyActions[i] = KeyActionHelper.fromKeyAction(keyAction);
                }
            }
        }
    }

    private extendUhk60LayerWithNoneActions(uhk60Layer: Layer, uhk80Layer: Layer) {
        for (const module of uhk60Layer.modules) {
            const uhk80Module = uhk80Layer.modules.find(x => x.id === module.id);

            if (module.id === 0) {
                for (let i = UHK_60_RIGHT_MAX_KEY_ACTION_COUNT; i < uhk80Module.keyActions.length; i++) {
                    module.keyActions[i] = new NoneAction();
                }
            }
            // left half
            else if (module.id === 1) {
                for (let i = UHK_60_LEFT_MAX_KEY_ACTION_COUNT; i < uhk80Module.keyActions.length; i++) {
                    module.keyActions[i] = new NoneAction();
                }
            }
        }
    }

    private hasUhk80ConfiguredExcessKey(userConfig: UserConfiguration): boolean {
        for (const keymap of userConfig.keymaps) {
            for (const layer of keymap.layers) {
                for (const module of layer.modules) {
                    // right and left halves
                    if (module.id === 0 || module.id === 1) {
                        let i = module.id === 0
                            ? UHK_60_RIGHT_MAX_KEY_ACTION_COUNT
                            : UHK_60_LEFT_MAX_KEY_ACTION_COUNT;

                        for (; i < module.keyActions.length; i++) {
                            const keyAction = module.keyActions[i];
                            if (keyAction !== null && keyAction !== undefined) {
                                return true;
                            }
                        }
                    }
                }
            }
        }
    }
}
