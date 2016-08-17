import { Component } from '@angular/core';
import { Keymap } from '../../../../config-serializer/config-items/Keymap';
import { Keymaps } from '../../../../config-serializer/config-items/Keymaps';
import { SearchPipe } from './search.pipe';
import { SvgKeyboardComponent } from '../../svg/keyboard/svg-keyboard.component';
import { UhkConfigurationService } from '../../../services/uhk-configuration.service';

@Component({
    directives: [SvgKeyboardComponent],
    pipes: [SearchPipe],
    providers: [UhkConfigurationService],
    selector: 'keymap-add',
    styles: [require('./keymap-add.component.scss')],
    template: require('./keymap-add.component.html')
})
export class KeymapAddComponent {

    private keymaps: Keymap[];

    constructor() {
        let json: any = require('json!../../../../config-serializer/all-keymaps.json');
        let all: Keymaps = new Keymaps().fromJsObject(json.keymaps);
        this.keymaps = all.elements;
    }
}
