import { Component, HostListener, ViewEncapsulation } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { Observable } from 'rxjs/Observable';
import { Action, Store } from '@ngrx/store';

import 'rxjs/add/operator/last';

import { DoNotUpdateAppAction, UpdateAppAction } from './store/actions/app-update.action';
import {
    AppState,
    getShowAppUpdateAvailable,
    deviceConnected,
    runningInElectron,
    saveToKeyboardState
} from './store';
import { ProgressButtonState } from './store/reducers/progress-button-state';
import { SaveUserConfigInBinaryFileAction, SaveUserConfigInJsonFileAction } from './store/actions/user-config';

@Component({
    selector: 'main-app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: [
        trigger(
            'showSaveToKeyboardButton', [
                transition(':enter', [
                    style({transform: 'translateY(100%)'}),
                    animate('400ms ease-in-out', style({transform: 'translateY(0)'}))
                ]),
                transition(':leave', [
                    style({transform: 'translateY(0)'}),
                    animate('400ms ease-in-out', style({transform: 'translateY(100%)'}))
                ])
            ])
    ]
})
export class MainAppComponent {
    showUpdateAvailable$: Observable<boolean>;
    deviceConnected$: Observable<boolean>;
    runningInElectron$: Observable<boolean>;
    saveToKeyboardState$: Observable<ProgressButtonState>;

    constructor(private store: Store<AppState>) {
        this.showUpdateAvailable$ = store.select(getShowAppUpdateAvailable);
        this.deviceConnected$ = store.select(deviceConnected);
        this.runningInElectron$ = store.select(runningInElectron);
        this.saveToKeyboardState$ = store.select(saveToKeyboardState);
    }

    updateApp() {
        this.store.dispatch(new UpdateAppAction());
    }

    doNotUpdateApp() {
        this.store.dispatch(new DoNotUpdateAppAction());
    }

    clickedOnProgressButton(action: Action) {
        return this.store.dispatch(action);
    }

    @HostListener('window:keydown.alt.j', ['$event'])
    onAltJ(event: KeyboardEvent): void {
        event.preventDefault();
        event.stopPropagation();
        this.store.dispatch(new SaveUserConfigInJsonFileAction());
    }

    @HostListener('window:keydown.alt.b', ['$event'])
    onAltB(event: KeyboardEvent): void {
        event.preventDefault();
        event.stopPropagation();
        this.store.dispatch(new SaveUserConfigInBinaryFileAction());
    }
}
