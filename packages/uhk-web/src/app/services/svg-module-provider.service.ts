import { Injectable } from '@angular/core';

import { SvgModule } from '../components/svg/module';
import { KeyboardLayout } from '../keyboard/keyboard-layout.enum';

@Injectable()
export class SvgModuleProviderService {

    private ansiLeft: SvgModule;
    private isoLeft: SvgModule;
    private right: SvgModule;

    getSvgModules(layout = KeyboardLayout.ANSI): SvgModule[] {
        return [this.getRightModule(), this.getLeftModule(layout)];
    }

    private getLeftModule(layout = KeyboardLayout.ANSI): SvgModule {
        if (layout === KeyboardLayout.ISO) {
            if (!this.isoLeft) {
                this.isoLeft = new SvgModule(require('xml-loader!../../modules/uhk60-left-half/layout-iso.xml').svg);
            }
            return this.isoLeft;
        }
        if (!this.ansiLeft) {
            this.ansiLeft = new SvgModule(require('xml-loader!../../modules/uhk60-left-half/layout-ansi.xml').svg);
        }
        return this.ansiLeft;
    }

    private getRightModule(): SvgModule {

        if (!this.right) {
            this.right = new SvgModule(require('xml-loader!../../modules/uhk60-right-half/layout.xml').svg);
        }
        return this.right;
    }
}
