import { Component, HostListener, ViewEncapsulation } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import { DoNotUpdateAppAction, UpdateAppAction } from './store/actions/app-update.action';
import {
    AppState,
    getShowAppUpdateAvailable,
    deviceConnected,
    runningInElectron,
    showSaveToKeyboardButton,
    savingToKeyboard
} from './store';
import { getUserConfiguration } from './store/reducers/user-configuration';
import { UhkBuffer } from './config-serializer/uhk-buffer';
import { SaveConfigurationAction } from './store/actions/device';

@Component({
    selector: 'main-app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: [
        trigger(
            'showSaveToKeyboardButton', [
                transition(':enter', [
                        style({ transform: 'translateY(100%)' }),
                        animate('400ms ease-in-out', style({ transform: 'translateY(0)' }))
                    ]),
                transition(':leave', [
                    style({ transform: 'translateY(0)' }),
                    animate('400ms ease-in-out', style({ transform: 'translateY(100%)' }))
                ])
            ])
    ]
})
export class MainAppComponent {
    showUpdateAvailable$: Observable<boolean>;
    deviceConnected$: Observable<boolean>;
    runningInElectron$: Observable<boolean>;
    showSaveToKeyboardButton$: Observable<boolean>;
    savingToKeyboard$: Observable<boolean>;

    constructor(private store: Store<AppState>) {
        this.showUpdateAvailable$ = store.select(getShowAppUpdateAvailable);
        this.deviceConnected$ = store.select(deviceConnected);
        this.runningInElectron$ = store.select(runningInElectron);
        this.showSaveToKeyboardButton$ = store.select(showSaveToKeyboardButton);
        this.savingToKeyboard$ = store.select(savingToKeyboard);
    }

    updateApp() {
        this.store.dispatch(new UpdateAppAction());
    }

    doNotUpdateApp() {
        this.store.dispatch(new DoNotUpdateAppAction());
    }

    saveToKeyboard() {
        console.log('clicked saveToKeyboard');
        this.store.dispatch(new SaveConfigurationAction());
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
}
