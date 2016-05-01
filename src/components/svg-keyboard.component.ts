import { Component, OnInit, Input} from 'angular2/core';

import {Module} from '../../config-serializer/config-items/Module';
import {SvgModule} from './svg-module.model';
import {SvgModuleComponent} from './svg-module.component';

@Component({
    selector: 'svg-keyboard',
    template:
    `
        <svg xmlns="http://www.w3.org/2000/svg" [attr.viewBox]="svgAttributes.viewBox" height="100%" width="100%">
            <svg:g [attr.transform]="svgAttributes.transform" [attr.fill]="svgAttributes.fill">
                <svg:g svg-module *ngFor="let module of modules; let i = index"
                        [coverages]="module.coverages"
                        [keyboardKeys]="module.keyboardKeys"
                        [attr.transform]="module.attributes.transform"
                        [keyActions]="moduleConfig[i].keyActions.elements"
                />
            </svg:g>
        </svg>
    `,
    styles:
    [`
        :host {
            display: flex;
            width: 100%;
            height: 100%;
        }
    `],
    directives: [SvgModuleComponent]
})
export class SvgKeyboardComponent implements OnInit {
    @Input() svgAttributes: { viewBox: string, transform: string, fill: string };
    @Input() modules: SvgModule[];
    @Input() moduleConfig: Module[];

    constructor() {
        this.modules = [];
    }

    ngOnInit() { }

}
