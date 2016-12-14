import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Module } from '../../../config-serializer/config-items/Module';
import { SvgModule } from '../module';

@Component({
    selector: 'svg-keyboard',
    template: require('./svg-keyboard.component.html'),
    styles: [require('./svg-keyboard.component.scss')]
})
export class SvgKeyboardComponent implements OnInit {
    @Input() moduleConfig: Module[];
    @Input() keybindAnimationEnabled: boolean;
    @Output() keyClick = new EventEmitter();
    @Output() keyHover = new EventEmitter();

    private modules: SvgModule[];
    private svgAttributes: { viewBox: string, transform: string, fill: string };

    constructor() {
        this.modules = [];
        this.svgAttributes = this.getKeyboardSvgAttributes();
    }

    ngOnInit() {
        this.modules = this.getSvgModules();
    }

    onKeyClick(moduleId: number, keyId: number, keyTarget: HTMLElement): void {
        this.keyClick.emit({
            moduleId,
            keyId,
            keyTarget
        });
    }

    onKeyHover(keyId: number, event: MouseEvent, over: boolean, moduleId: number): void {
        this.keyHover.emit({
            moduleId,
            event,
            over,
            keyId
        });
    }

    private getKeyboardSvgAttributes(): { viewBox: string, transform: string, fill: string } {
        let svg: any = this.getBaseLayer();
        return {
            viewBox: svg.$.viewBox,
            transform: svg.g[0].$.transform,
            fill: svg.g[0].$.fill
        };
    }

    private getSvgModules(): SvgModule[] {
        let modules = this.getBaseLayer().g[0].g.map((obj: any) => new SvgModule(obj));
        return [modules[1], modules[0]]; // TODO: remove if the svg will be correct
    }

    private getBaseLayer(): any {
        return require('xml!../../../../images/base-layer.svg').svg;
    }

}
