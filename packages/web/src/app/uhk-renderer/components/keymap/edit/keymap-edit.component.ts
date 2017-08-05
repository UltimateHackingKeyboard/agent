// import { Component, HostListener, ViewChild } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
//
// import '@ngrx/core/add/operator/select';
// import { Store } from '@ngrx/store';
//
// import 'rxjs/add/operator/do';
// import 'rxjs/add/operator/first';
// import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/switchMap';
//
// // import { Keymap } from '../../../config-serializer/config-items/keymap';
// // import { UhkBuffer } from '../../../shared/config-serializer/uhk-buffer';
// // import { AppState } from '../../../shared/store';
// // import { SvgKeyboardWrapComponent } from '../../../shared/components/svg/wrap';
// // import { KeymapEditComponent as SharedKeymapEditComponent } from '../../../shared/components/keymap/edit';
//
// import { UhkDeviceService } from '../../../../../agent-renderer/services/uhk-device.service';
//
// @Component({
//     selector: 'keymap-edit',
//     templateUrl: '../../../shared/components/keymap/edit/keymap-edit.component.html',
//     styleUrls: ['../../../shared/components/keymap/edit/keymap-edit.component.scss'],
//     host: {
//         'class': 'container-fluid'
//     }
// })
// export class KeymapEditComponent /*extends SharedKeymapEditComponent */{
//
//     // @ViewChild(SvgKeyboardWrapComponent) wrap: SvgKeyboardWrapComponent;
//     //
//     // constructor(
//     //     store: Store<AppState>,
//     //     route: ActivatedRoute,
//     //     private uhkDevice: UhkDeviceService
//     // ) {
//     //     super(store, route);
//     // }
//     //
//     // @HostListener('window:keydown.control.u', ['$event'])
//     // onCtrlU(event: KeyboardEvent): void {
//     //     console.log('ctrl + u pressed');
//     //     event.preventDefault();
//     //     event.stopPropagation();
//     //     this.sendLayer();
//     // }
//     //
//     // @HostListener('window:keydown.control.i', ['$event'])
//     // onCtrlI(event: KeyboardEvent): void {
//     //     console.log('ctrl + i pressed');
//     //     event.preventDefault();
//     //     event.stopPropagation();
//     //     this.sendKeymap();
//     // }
//     //
//     // private sendLayer(): void {
//     //     const currentLayer: number = this.wrap.getSelectedLayer();
//     //     this.keymap$
//     //         .first()
//     //         .map(keymap => keymap.layers[currentLayer])
//     //         .map(layer => {
//     //             const uhkBuffer = new UhkBuffer();
//     //             layer.toBinary(uhkBuffer);
//     //             return uhkBuffer.getBufferContent();
//     //         })
//     //         .switchMap((buffer: Buffer) => this.uhkDevice.sendConfig(buffer))
//     //         .do(response => console.log('Sending layer finished', response))
//     //         .switchMap(() => this.uhkDevice.applyConfig())
//     //         .subscribe(
//     //         response => console.log('Applying layer finished', response),
//     //         error => console.error('Error during uploading layer', error),
//     //         () => console.log('Layer has been sucessfully uploaded')
//     //         );
//     // }
//     //
//     // private sendKeymap(): void {
//     //     this.keymap$
//     //         .first()
//     //         .map(keymap => {
//     //             const uhkBuffer = new UhkBuffer();
//     //             keymap.toBinary(uhkBuffer);
//     //             return uhkBuffer.getBufferContent();
//     //         })
//     //         .switchMap((buffer: Buffer) => this.uhkDevice.sendConfig(buffer))
//     //         .do(response => console.log('Sending keymap finished', response))
//     //         .switchMap(() => this.uhkDevice.applyConfig())
//     //         .subscribe(
//     //         response => console.log('Applying keymap finished', response),
//     //         error => console.error('Error during uploading keymap', error),
//     //         () => console.log('Keymap has been sucessfully uploaded')
//     //         );
//     // }
//
// }
