import { Injectable, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { isEqual } from 'lodash';
import { Subscription } from 'rxjs';
import {
    getDefaultHalvesInfo,
    HalvesInfo,
    KeyboardLayout,
    LeftSlotModules,
    RightSlotModules,
    UHK_60_V2_DEVICE,
    UHK_80_DEVICE,
} from 'uhk-common';

import { SvgModule } from '../components/svg/module';
import { convertXmlToSvgSeparator, SvgSeparator } from '../components/svg/separator';
import { AppState, getConnectedDevice, getHalvesInfo } from '../store/index';

export interface DescriptionAnimationParams {
    down: string;
    up: string;
    upLeftKeyCluster: string;
    upRightModule: string;
}

export const UHK_60_DESCRIPTION_ANIMATION_PARAMS: DescriptionAnimationParams = Object.freeze({
    down: '-5.5em',
    up: '-11.5%',
    upLeftKeyCluster: '-8%',
    upRightModule: '-10.5%',
});

@Injectable()
export class SvgModuleProviderService implements OnDestroy {

    private ansiLeft: SvgModule;
    private halvesInfo: HalvesInfo = getDefaultHalvesInfo();
    private isoLeft: SvgModule;
    private keyClusterLeft: SvgModule;
    private right: SvgModule;
    private separator: SvgSeparator;
    private touchPadRight: SvgModule;
    private trackBallRight: SvgModule;
    private trackPointRight: SvgModule;
    private connectedDeviceId = UHK_60_V2_DEVICE.id;
    private descriptionAnimationParams: DescriptionAnimationParams;
    private subscriptions = new Subscription();
    private viewBox: string;

    constructor(private _store: Store<AppState>) {
        this.setUHK60Modules();

        this.subscriptions.add(this._store.select(getConnectedDevice).subscribe(device => {
            const connectedDeviceId = device?.id || UHK_60_V2_DEVICE.id;
            if (connectedDeviceId === this.connectedDeviceId) {
                return;
            }

            this.connectedDeviceId = connectedDeviceId;
            this.setModules();
        }));

        this.subscriptions.add(this._store.select(getHalvesInfo).subscribe(halvesInfo => {
            if (isEqual(this.halvesInfo, halvesInfo)) {
                return;
            }

            this.halvesInfo = halvesInfo;
            this.setModules();
        }));
    }

    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    getDescriptionAnimationParams(): DescriptionAnimationParams {
        return this.descriptionAnimationParams;
    }

    getSvgModules(layout = KeyboardLayout.ANSI): SvgModule[] {
        const modules = [this.getRightModule()];

        if (this.halvesInfo.isLeftHalfConnected) {
            modules.push(this.getLeftModule(layout));
        }

        switch (this.halvesInfo.leftModuleSlot) {
            case LeftSlotModules.KeyClusterLeft:
                modules.push(this.getKeyClusterLeft());
                break;
        }

        switch (this.halvesInfo.rightModuleSlot) {
            case RightSlotModules.TouchpadRight:
                modules.push(this.getTouchPadRight());
                break;

            case RightSlotModules.TrackballRight:
                modules.push(this.getTrackBallRight());
                break;

            case RightSlotModules.TrackpointRight:
                modules.push(this.getTrackPointRight());
                break;
        }

        return modules;
    }

    getSvgSeparator(): SvgSeparator {
        return this.separator;
    }

    getViewBox(): string {
        return this.viewBox;
    }

    private getLeftModule(layout = KeyboardLayout.ANSI): SvgModule {
        if (layout === KeyboardLayout.ISO) {
            return this.isoLeft;
        }

        return this.ansiLeft;
    }

    private getKeyClusterLeft(): SvgModule {
        if (!this.keyClusterLeft) {
            this.keyClusterLeft = new SvgModule(require('!xml-loader!../../modules/keyclusterleft/module.svg').svg);
        }

        return this.keyClusterLeft;
    }

    private getRightModule(): SvgModule {
        return this.right;
    }

    private setModules() {
        switch (this.connectedDeviceId) {
            case UHK_80_DEVICE.id: {
                this.separator = convertXmlToSvgSeparator(require('!xml-loader!../../devices/uhk80-right/separator.svg').svg);
                this.right = new SvgModule(require('!xml-loader!../../devices/uhk80-right/layout.svg').svg);
                this.isoLeft = new SvgModule(require('!xml-loader!../../modules/uhk80-left/layout-iso.svg').svg);
                this.ansiLeft = new SvgModule(require('!xml-loader!../../modules/uhk80-left/layout-ansi.svg').svg);

                if (this.halvesInfo?.areHalvesMerged) {
                    this.descriptionAnimationParams = {
                        down: '-4em',
                        up: '-5.5%',
                        upLeftKeyCluster: '-4.5%',
                        upRightModule: '-5.5%',
                    };
                    this.viewBox = '-520 660 1250 600';
                }
                else {
                    this.descriptionAnimationParams = {
                        down: '-0.5em',
                        up: '-5.5%',
                        upLeftKeyCluster: '-4.5%',
                        upRightModule: '-5.5%',
                    };
                    this.viewBox = '-550 610 1250 600';
                }
                break;
            }

            default: {
                this.setUHK60Modules();
                break;
            }
        }
    }

    private getTouchPadRight(): SvgModule {
        if (!this.touchPadRight) {
            this.touchPadRight = new SvgModule(require('!xml-loader!../../modules/touchpadright/module.svg').svg);
        }

        return this.touchPadRight;
    }

    private getTrackBallRight(): SvgModule {
        if (!this.trackBallRight) {
            this.trackBallRight = new SvgModule(require('!xml-loader!../../modules/trackballright/module.svg').svg);
        }

        return this.trackBallRight;
    }

    private getTrackPointRight(): SvgModule {
        if (!this.trackPointRight) {
            this.trackPointRight = new SvgModule(require('!xml-loader!../../modules/trackpointright/module.svg').svg);
        }

        return this.trackPointRight;
    }

    private setUHK60Modules() {
        this.descriptionAnimationParams = UHK_60_DESCRIPTION_ANIMATION_PARAMS;
        this.separator = convertXmlToSvgSeparator(require('!xml-loader!../../devices/uhk60-right/separator.svg').svg);
        this.right = new SvgModule(require('!xml-loader!../../devices/uhk60-right/layout.svg').svg);
        this.isoLeft = new SvgModule(require('!xml-loader!../../modules/uhk60-left/layout-iso.svg').svg);
        this.ansiLeft = new SvgModule(require('!xml-loader!../../modules/uhk60-left/layout-ansi.svg').svg);
        this.viewBox = '-600 660 1250 600';
    }
}
