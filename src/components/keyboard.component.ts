import { Component, OnInit} from 'angular2/core';

import {DataProviderService} from '../services/data-provider.service';
import {Module, ModuleComponent} from './module';

@Component({
    selector: 'keyboard',
    template:
    `
        <module *ngIf="modules.length > 0"
                [case]="modules[0].case"
                [keyboardButtons]="modules[0].keyboardButtons"
                [fill]="modules[0].fill">
        </module>
    `,
    styles:
    [`
        :host {
            display: flex;
            height: 100%;
            width: 100%;
        }
    `],
    directives: [ModuleComponent]
})
export class KeyboardComponent implements OnInit {
    private modules: Module[];

    constructor(private dps: DataProviderService) {
        this.modules = [];
    }

    ngOnInit() {
        this.loadKeyboardModules();
    }

    private loadKeyboardModules(): void {
        let svg: any = this.dps.getBaseLayer();
        this.modules = svg.g[0].g.map(obj => new Module(obj, svg.g[0].$.fill));
    }

}
