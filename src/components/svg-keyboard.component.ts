import { Component, OnInit, Input} from '@angular/core';

import {Module} from '../../config-serializer/config-items/Module';
import {SvgModule} from './svg-module.model';
import {SvgModuleComponent} from './svg-module.component';
import {PopoverComponent} from './popover/popover.component';

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
                        (editKeyActionRequest)="onEditKeyActionRequest(i, $event)"
                />
            </svg:g>
        </svg>
        <popover *ngIf="popoverEnabled" (cancel)="hidePopover()"></popover>
    `,
    styles:
    [`
        :host {
            display: flex;
            width: 100%;
            height: 100%;
            position: relative;
        }
    `],
    directives: [SvgModuleComponent, PopoverComponent]
})
export class SvgKeyboardComponent implements OnInit {
    @Input() svgAttributes: { viewBox: string, transform: string, fill: string };
    @Input() modules: SvgModule[];
    @Input() moduleConfig: Module[];

    private popoverEnabled: boolean;

    constructor() {
        this.modules = [];
    }

    ngOnInit() { }

    onEditKeyActionRequest(moduleId: number, keyId: number): void {
        this.showPopover();
    }

    showPopover(): void {
        this.popoverEnabled = true;
    }

    hidePopover(): void {
        this.popoverEnabled = false;
    }

}
