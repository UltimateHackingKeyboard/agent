import { Injectable } from '@angular/core';

import { SvgModule } from '../components/svg/module/svg-module.model';

@Injectable()
export class DataProviderService {

    constructor() { }

    getUHKConfig(): any {
        return require('json!../config-serializer/uhk-config.json');
    }

    getDefaultKeymaps(): any {
        return require('json!../config-serializer/preset-keymaps.json');
    }

    getKeyboardSvgAttributes(): { viewBox: string, transform: string, fill: string } {
        let svg: any = this.getBaseLayer();
        return {
            viewBox: svg.$.viewBox,
            transform: svg.g[0].$.transform,
            fill: svg.g[0].$.fill
        };
    }

    getSvgModules(): SvgModule[] {
        let modules = this.getBaseLayer().g[0].g.map((obj: any) => new SvgModule(obj));
        return [modules[1], modules[0]]; // TODO: remove if the svg will be correct
    }

    private getBaseLayer(): any {
        return require('xml!../../images/base-layer.svg').svg;
    }

}
