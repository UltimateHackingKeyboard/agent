import { Component, HostListener, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import { DoNotUpdateAppAction, UpdateAppAction } from './store/actions/app-update.action';
import {
    AppState,
    getShowAppUpdateAvailable,
    deviceConnected,
    runningInElectron
} from './store';
import { getUserConfiguration } from './store/reducers/user-configuration';
import { UhkBuffer } from './config-serializer/uhk-buffer';
import { SaveConfigurationAction } from './store/actions/device';

@Component({
    selector: 'main-app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class MainAppComponent {
    showUpdateAvailable$: Observable<boolean>;
    deviceConnected$: Observable<boolean>;
    runningInElectron$: Observable<boolean>;

    constructor(private store: Store<AppState>) {
        this.showUpdateAvailable$ = store.select(getShowAppUpdateAvailable);
        this.deviceConnected$ = store.select(deviceConnected);
        this.runningInElectron$ = store.select(runningInElectron);
    }

    updateApp() {
        this.store.dispatch(new UpdateAppAction());
    }

    doNotUpdateApp() {
        this.store.dispatch(new DoNotUpdateAppAction());
    }

    @HostListener('window:keydown.control.o', ['$event'])
    onCtrlO(event: KeyboardEvent): void {
        console.log('ctrl + o pressed');
        event.preventDefault();
        event.stopPropagation();
        this.sendUserConfiguration();
    }

    @HostListener('window:keydown.alt.j', ['$event'])
    onAltJ(event: KeyboardEvent): void {
        event.preventDefault();
        event.stopPropagation();
        this.store
            .let(getUserConfiguration())
            .first()
            .subscribe(userConfiguration => {
                const asString = JSON.stringify(userConfiguration.toJsonObject());
                const asBlob = new Blob([asString], { type: 'text/plain' });
                saveAs(asBlob, 'UserConfiguration.json');
            });
    }

    @HostListener('window:keydown.alt.b', ['$event'])
    onAltB(event: KeyboardEvent): void {
        event.preventDefault();
        event.stopPropagation();
        this.store
            .let(getUserConfiguration())
            .first()
            .map(userConfiguration => {
                const uhkBuffer = new UhkBuffer();
                userConfiguration.toBinary(uhkBuffer);
                return new Blob([uhkBuffer.getBufferContent()]);
            })
            .subscribe(blob => saveAs(blob, 'UserConfiguration.bin'));
    }

    private sendUserConfiguration(): void {
        this.store
            .let(getUserConfiguration())
            .first()
            .map(userConfiguration => {
                const uhkBuffer = new UhkBuffer();
                userConfiguration.toBinary(uhkBuffer);
                return uhkBuffer.getBufferContent();
            })
            .subscribe(
                buffer => this.store.dispatch(new SaveConfigurationAction(buffer)),
                error => console.error('Error during uploading user configuration', error),
                () => console.log('User configuration has been successfully uploaded')
            );
    }
}
