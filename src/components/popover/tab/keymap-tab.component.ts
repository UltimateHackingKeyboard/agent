import { Component, OnInit } from '@angular/core';

import {UhkConfigurationService} from '../../../services/uhk-configuration.service';
import {Keymap} from '../../../../config-serializer/config-items/Keymap';
import {SvgKeyboardComponent} from '../../svg-keyboard.component';

@Component({
    moduleId: module.id,
    selector: 'keymap-tab',
    template:
    `
        <div>
            <b style="">Switch to keymap:</b>
            <select class="layout-switcher" [(ngModel)]="selectedKeymapIndex">
                <option [ngValue]="-1"> Select keymap </option>
                <option *ngFor="let keymap of keymaps; let index=index" [ngValue]="index"> {{ keymap.name }} </option>
            </select>
        </div>
        <div>
            <div>
                <img *ngIf="selectedKeymapIndex === -1" src="images/base-layer--blank.svg">
            </div>
            <svg-keyboard *ngIf="selectedKeymapIndex !== -1"
                        [moduleConfig]="keymaps[selectedKeymapIndex].layers.elements[0].modules.elements">
            </svg-keyboard>
        </div>
    `,
    styles: [require('./keymap-tab.component.scss')],
    directives: [SvgKeyboardComponent]
})
export class KeymapTabComponent implements OnInit {

    private keymaps: Keymap[];
    private selectedKeymapIndex: number;

    constructor(uhkConfigurationService: UhkConfigurationService) {
        this.selectedKeymapIndex = -1;
        this.keymaps = uhkConfigurationService.getUhkConfiguration().keymaps.elements;
    }

    ngOnInit() { }

}
