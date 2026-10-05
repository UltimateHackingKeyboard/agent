import { Injectable, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import {
    HalvesInfo,
    KeyboardLayout,
    LeftSlotModules,
    RightSlotModules,
    UHK_60_V2_DEVICE,
    UHK_80_DEVICE,
} from 'uhk-common';

import { SvgModule } from '../components/svg/module';
import { parseSvg } from '../components/svg/parse-svg';
import { convertXmlToSvgSeparator, SvgSeparator } from '../components/svg/separator';
import { AppState, getConnectedDevice } from '../store/index';

import keyClusterLeftSvg from '../../modules/keyclusterleft/module.svg';
import touchPadRightSvg from '../../modules/touchpadright/module.svg';
import trackBallRightSvg from '../../modules/trackballright/module.svg';
import trackPointRightSvg from '../../modules/trackpointright/module.svg';
import uhk80LeftAnsiSvg from '../../modules/uhk80-left/layout-ansi.svg';
import uhk80LeftIsoSvg from '../../modules/uhk80-left/layout-iso.svg';
import uhk80SeparatorSvg from '../../devices/uhk80-right/separator.svg';
import uhk80RightSvg from '../../devices/uhk80-right/layout.svg';
import uhk60LeftAnsiSvg from '../../modules/uhk60-left/layout-ansi.svg';
import uhk60LeftIsoSvg from '../../modules/uhk60-left/layout-iso.svg';
import uhk60SeparatorSvg from '../../devices/uhk60-right/separator.svg';
import uhk60RightSvg from '../../devices/uhk60-right/layout.svg';

export interface DescriptionAnimationParams {
    down: string;
    up: string;
    upLeftKeyCluster: string;
    upRightModule: string;
}

export const UHK_60_DESCRIPTION_ANIMATION_PARAMS: DescriptionAnimationParams = Object.freeze({
    down: '-5%',
    up: '-11.5%',
    upLeftKeyCluster: '-8%',
    upRightModule: '-10.5%',
});

@Injectable()
export class SvgModuleProviderService implements OnDestroy {

    private ansiLeft: SvgModule;
    private isoLeft: SvgModule;
    private keyClusterLeft: SvgModule;
    private right: SvgModule;
    private separator: SvgSeparator;
    private touchPadRight: SvgModule;
    private trackBallRight: SvgModule;
    private trackPointRight: SvgModule;
    private connectedDeviceId = UHK_60_V2_DEVICE.id;
    private subscriptions = new Subscription();

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
    }

    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    getDescriptionAnimationParams(halvesInfo: HalvesInfo): DescriptionAnimationParams {
        switch (this.connectedDeviceId) {
            case UHK_80_DEVICE.id: {
                return {
                    down: '-0.5em',
                    up: '-5.5%',
                    upLeftKeyCluster: '-4.5%',
                    upRightModule: '-5.5%',
                };
            }

            default: {
                return UHK_60_DESCRIPTION_ANIMATION_PARAMS;
            }
        }
    }

    getSvgModules(layout = KeyboardLayout.ANSI, halvesInfo: HalvesInfo): SvgModule[] {
        const modules = [this.getRightModule()];

        if (halvesInfo.isLeftHalfConnected) {
            modules.push(this.getLeftModule(layout));
        }

        switch (halvesInfo.leftModuleSlot) {
            case LeftSlotModules.KeyClusterLeft:
                modules.push(this.getKeyClusterLeft());
                break;
        }

        switch (halvesInfo.rightModuleSlot) {
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

    getViewBox(halvesInfo: HalvesInfo): string {
        switch (this.connectedDeviceId) {
            case UHK_80_DEVICE.id: {
                if (halvesInfo?.areHalvesMerged) {

                    return '-520 660 1250 560';
                }

                return'-550 610 1250 600';
            }

            default: {
                return '-600 660 1250 600';
            }
        }
    }

    private getLeftModule(layout = KeyboardLayout.ANSI): SvgModule {
        if (layout === KeyboardLayout.ISO) {
            return this.isoLeft;
        }

        return this.ansiLeft;
    }

    private getKeyClusterLeft(): SvgModule {
        if (!this.keyClusterLeft) {
            this.keyClusterLeft = new SvgModule(parseSvg(keyClusterLeftSvg));
        }

        return this.keyClusterLeft;
    }

    private getRightModule(): SvgModule {
        return this.right;
    }

    private setModules() {
        switch (this.connectedDeviceId) {
            case UHK_80_DEVICE.id: {
                this.separator = convertXmlToSvgSeparator(parseSvg(uhk80SeparatorSvg));
                this.right = new SvgModule(parseSvg(uhk80RightSvg));
                this.isoLeft = new SvgModule(parseSvg(uhk80LeftIsoSvg));
                this.ansiLeft = new SvgModule(parseSvg(uhk80LeftAnsiSvg));
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
            this.touchPadRight = new SvgModule(parseSvg(touchPadRightSvg));
        }

        return this.touchPadRight;
    }

    private getTrackBallRight(): SvgModule {
        if (!this.trackBallRight) {
            this.trackBallRight = new SvgModule(parseSvg(trackBallRightSvg));
        }

        return this.trackBallRight;
    }

    private getTrackPointRight(): SvgModule {
        if (!this.trackPointRight) {
            this.trackPointRight = new SvgModule(parseSvg(trackPointRightSvg));
        }

        return this.trackPointRight;
    }

    private setUHK60Modules() {
        this.separator = convertXmlToSvgSeparator(parseSvg(uhk60SeparatorSvg));
        this.right = new SvgModule(parseSvg(uhk60RightSvg));
        this.isoLeft = new SvgModule(parseSvg(uhk60LeftIsoSvg));
        this.ansiLeft = new SvgModule(parseSvg(uhk60LeftAnsiSvg));
    }
}
