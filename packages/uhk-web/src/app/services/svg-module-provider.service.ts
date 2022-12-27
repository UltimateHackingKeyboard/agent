import { Injectable } from '@angular/core';
import { HalvesInfo, LeftSlotModules, RightSlotModules } from 'uhk-common';

import { SvgModule } from '../components/svg/module';
import { KeyboardLayout } from '../keyboard/keyboard-layout.enum';
import { convertXmlToSvgSeparator, SvgSeparator } from '../components/svg/separator';

@Injectable()
export class SvgModuleProviderService {

    private ansiLeft: SvgModule;
    private isoLeft: SvgModule;
    private keyClusterLeft: SvgModule;
    private right: SvgModule;
    private separator: SvgSeparator;
    private touchPadRight: SvgModule;
    private trackBallRight: SvgModule;
    private trackPointRight: SvgModule;

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
        if (!this.separator) {
            this.separator = convertXmlToSvgSeparator(require('!xml-loader!../../devices/uhk60-right/separator.svg').svg);
        }

        return this.separator;
    }

    private getLeftModule(layout = KeyboardLayout.ANSI): SvgModule {
        if (layout === KeyboardLayout.ISO) {
            if (!this.isoLeft) {
                this.isoLeft = new SvgModule(require('!xml-loader!../../modules/uhk60-left/layout-iso.svg').svg);
            }
            return this.isoLeft;
        }
        if (!this.ansiLeft) {
            this.ansiLeft = new SvgModule(require('!xml-loader!../../modules/uhk60-left/layout-ansi.svg').svg);
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

        if (!this.right) {
            this.right = new SvgModule(require('!xml-loader!../../devices/uhk60-right/layout.svg').svg);
        }
        return this.right;
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
}
