import { Component, OnInit} from 'angular2/core';

import {DataProviderService} from '../services/data-provider.service';
import {Module, ModuleComponent} from './module';

@Component({
    selector: 'keyboard',
    template:
    `
        <svg xmlns="http://www.w3.org/2000/svg" [attr.viewBox]="viewBox" height="100%" width="100%">
            <svg:g [attr.transform]="transform">
                <svg:g uhk-module *ngFor="#module of modules"
                        [case]="module.case"
                        [keyboardKeys]="module.keyboardKeys"
                        [fill]="module.fill"
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
    directives: [ModuleComponent]
})
export class KeyboardComponent implements OnInit {
    private viewBox: string;
    private modules: Module[];
    private svg: any;
    private transform: string;

    constructor(private dps: DataProviderService) {
        this.modules = [];
    }

    ngOnInit() {
        this.svg = this.dps.getBaseLayer();
        this.viewBox = this.svg.$.viewBox;
        this.transform = this.svg.g[0].$.transform;
        this.modules = this.svg.g[0].g.map(obj => new Module(obj, this.svg.g[0].$.fill));
    }

}
