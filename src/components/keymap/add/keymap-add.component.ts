import { Component } from '@angular/core';

import { Keymap } from '../../../config-serializer/config-items/Keymap';
import { Keymaps } from '../../../config-serializer/config-items/Keymaps';
import {DataProviderService} from '../../../services/data-provider.service';

@Component({
    selector: 'keymap-add',
    template: require('./keymap-add.component.html'),
    styles: [require('./keymap-add.component.scss')]
})
export class KeymapAddComponent {
    private keymaps: Keymap[];
    private keymapsAll: Keymap[];
    private currentKeyboards: number;

    constructor(data: DataProviderService) {
        let json: any = data.getDefaultKeymaps();
        let all: Keymaps = new Keymaps().fromJsObject(json.keymaps);
        this.keymaps = all.elements;
        this.keymapsAll = this.keymaps.slice(0);
        this.currentKeyboards = this.keymaps.length;
    }

    filterKeyboards(value: string) {
        this.keymaps = this.keymapsAll.filter((item: Keymap) => item.name.toLocaleLowerCase().indexOf(value) !== -1);
    }
}
