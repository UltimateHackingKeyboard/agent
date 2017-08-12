import { Component, HostListener, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import '@ngrx/core/add/operator/select';
import { Store } from '@ngrx/store';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/let';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/publishReplay';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/pluck';
import 'rxjs/add/operator/combineLatest';

import { saveAs } from 'file-saver';

import { Keymap } from '../../../config-serializer/config-items/keymap';
import { AppState } from '../../../store';
import { getKeymap, getKeymaps, getUserConfiguration } from '../../../store/reducers/user-configuration';
import 'rxjs/add/operator/pluck';
import { SvgKeyboardWrapComponent } from '../../svg/wrap/svg-keyboard-wrap.component';
import { UhkBuffer } from '../../../config-serializer/uhk-buffer';
import { SaveLayerAction } from '../../../store/actions/device';

@Component({
    selector: 'keymap-edit',
    templateUrl: './keymap-edit.component.html',
    styleUrls: ['./keymap-edit.component.scss'],
    host: {
        'class': 'container-fluid'
    }
})
export class KeymapEditComponent {

    @ViewChild(SvgKeyboardWrapComponent) wrap: SvgKeyboardWrapComponent;

    keyboardSplit: boolean;

    deletable$: Observable<boolean>;
    protected keymap$: Observable<Keymap>;

    constructor(protected store: Store<AppState>,
                route: ActivatedRoute) {
        this.keymap$ = route
            .params
            .pluck<{}, string>('abbr')
            .switchMap((abbr: string) => store.let(getKeymap(abbr)))
            .publishReplay(1)
            .refCount();

        this.deletable$ = store.let(getKeymaps())
            .map((keymaps: Keymap[]) => keymaps.length > 1);
    }

    downloadKeymap() {
        const exportableJSON$: Observable<string> = this.keymap$
            .switchMap(keymap => this.toExportableJSON(keymap))
            .map(exportableJSON => JSON.stringify(exportableJSON));

        this.keymap$
            .combineLatest(exportableJSON$)
            .first()
            .subscribe(latest => {
                const keymap = latest[0];
                const exportableJSON = latest[1];
                const fileName = keymap.name + '_keymap.json';
                saveAs(new Blob([exportableJSON], { type: 'application/json' }), fileName);
            });
    }

    @HostListener('window:keydown.alt.s', ['$event'])
    toggleKeyboardSplit() {
        this.keyboardSplit = !this.keyboardSplit;
    }

    @HostListener('window:keydown.control.u', ['$event'])
    onCtrlU(event: KeyboardEvent): void {
        console.log('ctrl + u pressed');
        event.preventDefault();
        event.stopPropagation();
        this.sendLayer();
    }

    private toExportableJSON(keymap: Keymap): Observable<any> {
        return this.store
            .let(getUserConfiguration())
            .first()
            .map(userConfiguration => {
                return {
                    site: 'https://ultimatehackingkeyboard.com',
                    description: 'Ultimate Hacking Keyboard keymap',
                    keyboardModel: 'UHK60',
                    dataModelVersion: userConfiguration.dataModelVersion,
                    objectType: 'keymap',
                    objectValue: keymap.toJsonObject()
                };
            });
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
            .subscribe(
                buffer => this.store.dispatch(new SaveLayerAction(buffer)),
                error => console.error('Error during uploading layer', error),
                () => console.log('Layer has been sucessfully uploaded')
            );
    }
}
