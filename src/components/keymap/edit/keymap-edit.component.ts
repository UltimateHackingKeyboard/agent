import { Component, HostListener, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import '@ngrx/core/add/operator/select';
import { Store } from '@ngrx/store';

import 'rxjs/add/operator/first';
import 'rxjs/add/operator/let';
import 'rxjs/add/operator/publishReplay';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Observable';

import { Keymap } from '../../../config-serializer/config-items/Keymap';
import { UhkBuffer } from '../../../config-serializer/UhkBuffer';
import { AppState } from '../../../store';
import { getKeymap, getKeymapEntities } from '../../../store/reducers/keymap';
import { SvgKeyboardWrapComponent } from '../../svg/wrap';

import { UhkDeviceService } from '../../../services/uhk-device.service';

@Component({
    selector: 'keymap-edit',
    template: require('./keymap-edit.component.html'),
    styles: [require('./keymap-edit.component.scss')],
    host: {
        'class': 'container-fluid'
    }
})
export class KeymapEditComponent {

    @ViewChild(SvgKeyboardWrapComponent) wrap: SvgKeyboardWrapComponent;

    private keymap$: Observable<Keymap>;
    private deletable$: Observable<boolean>;

    constructor(
        private store: Store<AppState>,
        private route: ActivatedRoute,
        private uhkDevice: UhkDeviceService
    ) {
        this.keymap$ = route
            .params
            .select<string>('abbr')
            .switchMap((abbr: string) => store.let(getKeymap(abbr)))
            .publishReplay(1)
            .refCount();

        this.deletable$ = store.let(getKeymapEntities())
            .map((keymaps: Keymap[]) => keymaps.length > 1);
    }

    @HostListener('window:keydown.control.u', ['$event'])
    onCtrlU(event: KeyboardEvent): void {
        console.log('ctrl + u pressed');
        event.preventDefault();
        event.stopPropagation();
        this.sendLayer();
    }

    @HostListener('window:keydown.control.i', ['$event'])
    onCtrlI(event: KeyboardEvent): void {
        console.log('ctrl + i pressed');
        event.preventDefault();
        event.stopPropagation();
        this.sendKeymap();
    }

    private sendLayer(): void {
        const currentLayer: number = this.wrap.getSelectedLayer();
        this.keymap$
            .first()
            .map(keymap => keymap.layers[currentLayer])
            .map(layer => {
                const uhkBuffer = new UhkBuffer();
                layer.toBinary(uhkBuffer);
                return uhkBuffer.getBufferContent();
            })
            .switchMap((buffer: Buffer) => this.uhkDevice.sendConfig(buffer))
            .do(response => console.log('Sending layer finished', response))
            .switchMap(() => this.uhkDevice.applyConfig())
            .subscribe(
            (response) => console.log('Applying layer finished', response),
            error => console.error('Error during uploading layer', error),
            () => console.log('Layer has been sucessfully uploaded')
            );
    }

    private sendKeymap(): void {
        this.keymap$
            .first()
            .map(keymap => {
                const uhkBuffer = new UhkBuffer();
                keymap.toBinary(uhkBuffer);
                return uhkBuffer.getBufferContent();
            })
            .switchMap((buffer: Buffer) => this.uhkDevice.sendConfig(buffer))
            .do(response => console.log('Sending keymap finished', response))
            .switchMap(() => this.uhkDevice.applyConfig())
            .subscribe(
            (response) => console.log('Applying keymap finished', response),
            error => console.error('Error during uploading keymap', error),
            () => console.log('Keymap has been sucessfully uploaded')
            );
    }
}
