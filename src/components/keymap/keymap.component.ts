import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { SvgKeyboardWrapComponent } from '../svg/wrap';
import { Layers } from '../../../config-serializer/config-items/Layers';
import { UhkConfigurationService } from '../../services/uhk-configuration.service';
import { Keymap } from '../../../config-serializer/config-items/Keymap';
import { Subscription } from 'rxjs/Subscription';
import { LayersComponent } from '../layers';

@Component({
    selector: 'keymap',
    template: require('./keymap.component.html'),
    styles: [require('./keymap.component.scss')],
    directives: [SvgKeyboardWrapComponent, LayersComponent],
    providers: [UhkConfigurationService]
})
export class KeymapComponent implements OnInit {
    private keymapId: number = 0;

    private layers: Layers;
    private keymap: Keymap;

    private subParams: Subscription;

    constructor(
        private uhkConfigurationService: UhkConfigurationService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subParams = this.route.params.subscribe((params: { id: string }) => {
            let id: number = +params.id;

            if (!isNaN(id)) {
                this.keymapId = id;
            }

            this.keymap = this.uhkConfigurationService.getUhkConfiguration().keymaps.elements[this.keymapId];
            this.layers = this.keymap.layers;
        });
    }

    ngOnDestroy() {
        this.subParams.unsubscribe();
    }
}
