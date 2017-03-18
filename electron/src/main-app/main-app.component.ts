import { Component, ViewEncapsulation, HostListener } from '@angular/core';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';

import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/ignoreElements';
import 'rxjs/add/operator/takeWhile';

import { AppState } from '../shared/store';
import { getUserConfiguration } from '../shared/store/reducers/user-configuration';

import { UhkBuffer } from '../shared/config-serializer/UhkBuffer';

import { UhkDeviceService } from '../services/uhk-device.service';

@Component({
    selector: 'main-app',
    templateUrl: './main-app.component.html',
    styleUrls: ['../shared/main-app/main-app.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class MainAppComponent {

    constructor(private uhkDevice: UhkDeviceService, private store: Store<AppState>, router: Router) {
        uhkDevice.isInitialized()
            .distinctUntilChanged()
            .takeWhile(initialized => initialized)
            .ignoreElements()
            .subscribe({
                complete: () => {
                    router.navigate(['/detection']);
                }
            });
    }

    @HostListener('window:keydown.control.o', ['$event'])
    onCtrlO(event: KeyboardEvent): void {
        console.log('ctrl + o pressed');
        event.preventDefault();
        event.stopPropagation();
        this.sendUserConfiguration();
    }

    private sendUserConfiguration(): void {
        this.store
            .let(getUserConfiguration())
            .map(userConfiguration => {
                const uhkBuffer = new UhkBuffer();
                userConfiguration.toBinary(uhkBuffer);
                return uhkBuffer.getBufferContent();
            })
            .switchMap((buffer: Buffer) => this.uhkDevice.sendConfig(buffer))
            .do(response => console.log('Sending user configuration finished', response))
            .switchMap(() => this.uhkDevice.applyConfig())
            .subscribe(
            response => console.log('Applying user configuration finished', response),
            error => console.error('Error during uploading user configuration', error),
            () => console.log('User configuration has been sucessfully uploaded')
            );
    }

}
