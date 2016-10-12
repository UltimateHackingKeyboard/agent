import { Injectable } from '@angular/core';

import { Keymap } from '../config-serializer/config-items/Keymap';
import { UhkConfiguration } from '../config-serializer/config-items/UhkConfiguration';

import { SvgModule } from '../components/svg/module/svg-module.model';

@Injectable()
export class DataProviderService {

    private uhkConfiguration: UhkConfiguration;

    constructor() {
        this.uhkConfiguration = new UhkConfiguration().fromJsObject(require('json!../config-serializer/uhk-config.json'));
    }

    getUHKConfig(): UhkConfiguration {
        return this.uhkConfiguration;
    }

    getDefaultKeymaps(): Keymap[] {
        return (<any[]>require('json!../config-serializer/preset-keymaps.json')).map(keymap => new Keymap().fromJsObject(keymap));
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
