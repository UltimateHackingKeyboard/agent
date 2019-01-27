import { Injectable } from '@angular/core';

import { SvgModule } from '../components/svg/module';
import { KeyboardLayout } from '../keyboard/keyboard-layout.enum';
import { convertXmlToSvgSeparator, SvgSeparator } from '../components/svg/separator';

@Injectable()
export class SvgModuleProviderService {
    private ansiLeft: SvgModule;
    private isoLeft: SvgModule;
    private right: SvgModule;
    private separator: SvgSeparator;

    getSvgModules(layout = KeyboardLayout.ANSI): SvgModule[] {
        return [this.getRightModule(), this.getLeftModule(layout)];
    }

    getSvgSeparator(): SvgSeparator {
        if (!this.separator) {
            this.separator = convertXmlToSvgSeparator(require('xml-loader!../../devices/uhk60-right/separator.xml').svg);
        }

        return this.separator;
    }

    private getLeftModule(layout = KeyboardLayout.ANSI): SvgModule {
        if (layout === KeyboardLayout.ISO) {
            if (!this.isoLeft) {
                this.isoLeft = new SvgModule(require('xml-loader!../../modules/uhk60-left/layout-iso.xml').svg);
            }
            return this.isoLeft;
        }
        if (!this.ansiLeft) {
            this.ansiLeft = new SvgModule(require('xml-loader!../../modules/uhk60-left/layout-ansi.xml').svg);
        }
        return this.ansiLeft;
    }

    private getRightModule(): SvgModule {
        if (!this.right) {
            this.right = new SvgModule(require('xml-loader!../../devices/uhk60-right/layout.xml').svg);
        }
        return this.right;
    }
}
