import { Component, OnInit} from 'angular2/core';

import {DataProviderService} from '../services/data-provider.service';
import {SvgModule} from './svg-module.model';
import {SvgModuleComponent} from './svg-module.component';

@Component({
    selector: 'svg-keyboard',
    template:
    `
        <svg xmlns="http://www.w3.org/2000/svg" [attr.viewBox]="viewBox" height="100%" width="100%">
            <svg:g [attr.transform]="transform" [attr.fill]="fill">
                <svg:g svg-module *ngFor="#module of modules"
                        [coverages]="module.coverages"
                        [keyboardKeys]="module.keyboardKeys"
                        [attr.transform]="module.attributes.transform"
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
    private viewBox: string;
    private modules: SvgModule[];
    private svg: any;
    private transform: string;
    private fill: string;

    constructor(private dps: DataProviderService) {
        this.modules = [];
    }

    ngOnInit() {
        this.svg = this.dps.getBaseLayer();
        this.viewBox = this.svg.$.viewBox;
        this.transform = this.svg.g[0].$.transform;
        this.fill = this.svg.g[0].$.fill;
        this.modules = this.svg.g[0].g.map(obj => new SvgModule(obj));
    }

}
