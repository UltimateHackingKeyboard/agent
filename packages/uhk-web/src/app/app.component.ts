import { Component, HostListener, ViewEncapsulation, OnDestroy } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Action, Store } from '@ngrx/store';

import 'rxjs/add/operator/last';

import { DoNotUpdateAppAction, UpdateAppAction } from './store/actions/app-update.action';
import { EnableUsbStackTestAction } from './store/actions/device';
import {
    AppState,
    getShowAppUpdateAvailable,
    deviceConfigurationLoaded,
    runningInElectron,
    saveToKeyboardState,
    keypressCapturing
} from './store';
import { ProgressButtonState } from './store/reducers/progress-button-state';

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
export class MainAppComponent implements OnDestroy {
    showUpdateAvailable$: Observable<boolean>;
    deviceConfigurationLoaded$: Observable<boolean>;
    runningInElectron$: Observable<boolean>;
    saveToKeyboardState: ProgressButtonState;

    private keypressCapturing: boolean;
    private saveToKeyboardStateSubscription: Subscription;
    private keypressCapturingSubscription: Subscription;

    constructor(private store: Store<AppState>) {
        this.showUpdateAvailable$ = store.select(getShowAppUpdateAvailable);
        this.deviceConfigurationLoaded$ = store.select(deviceConfigurationLoaded);
        this.runningInElectron$ = store.select(runningInElectron);
        this.saveToKeyboardStateSubscription = store.select(saveToKeyboardState)
            .subscribe(data => this.saveToKeyboardState = data);
        this.keypressCapturingSubscription = store.select(keypressCapturing)
            .subscribe(data => this.keypressCapturing = data);
    }

    ngOnDestroy(): void {
        this.saveToKeyboardStateSubscription.unsubscribe();
        this.keypressCapturingSubscription.unsubscribe();
    }

    @HostListener('document:keydown', ['$event'])
    onKeyDown(event: KeyboardEvent) {
        if (this.saveToKeyboardState.showButton &&
            event.ctrlKey &&
            event.key === 's' &&
            !event.defaultPrevented &&
            !this.keypressCapturing) {
            this.clickedOnProgressButton(this.saveToKeyboardState.action);
            event.preventDefault();
        }

        if (event.shiftKey &&
            event.ctrlKey &&
            event.metaKey &&
            event.key === '|' &&
            !event.defaultPrevented) {
            this.enableUsbStackTest();
            event.preventDefault();
        }
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

    enableUsbStackTest() {
        this.store.dispatch(new EnableUsbStackTestAction());
    }
}
