import { Component, HostListener, ViewEncapsulation, OnDestroy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Event, NavigationEnd, Router } from '@angular/router';
import { animate, style, transition, trigger } from '@angular/animations';
import { Observable, Subscription } from 'rxjs';
import { Action, Store } from '@ngrx/store';

import { DoNotUpdateAppAction, UpdateAppAction } from './store/actions/app-update.action';
import { EnableUsbStackTestAction } from './store/actions/device';
import {
    AppState,
    getShowAppUpdateAvailable,
    deviceConfigurationLoaded,
    runningInElectron,
    saveToKeyboardState,
    keypressCapturing,
    getUpdateInfo,
    firstAttemptOfSaveToKeyboard,
    getOutOfSpaceWaringData
} from './store';
import { ProgressButtonState } from './store/reducers/progress-button-state';
import { UpdateInfo } from './models/update-info';
import { KeyUpAction, KeyDownAction } from './store/actions/app';
import { OutOfSpaceWarningData } from './models';
import { filter } from 'rxjs/operators';
import { SecondSideMenuContainerComponent } from './components/side-menu';

@Component({
    selector: 'main-app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: [
        trigger('showSaveToKeyboardButton', [
                transition(':enter', [
                    style({transform: 'translateY(100%)'}),
                    animate('400ms ease-in-out', style({transform: 'translateY(0)'}))
                ]),
                transition(':leave', [
                    style({transform: 'translateY(0)'}),
                    animate('400ms ease-in-out', style({transform: 'translateY(100%)'}))
                ])
            ]),
        trigger('showOutOfSpaceWarning', [
            transition(':enter', [
                style({transform: 'translateY(100%)'}),
                animate('400ms ease-in-out', style({transform: 'translateY(0)'}))
            ]),
            transition(':leave', [
                style({transform: 'translateY(0)'}),
                animate('400ms ease-in-out', style({transform: 'translateY(100%)'}))
            ])
        ]),
        trigger('updateAvailable', [
            transition(':enter', [
                style({transform: 'translateY(-45px)'}),
                animate('500ms ease-out', style({transform: 'translateY(0)'}))
            ]),
            transition(':leave', [
                style({transform: 'translateY(0)'}),
                animate('500ms ease-out', style({transform: 'translateY(-45px)'}))
            ])
        ]),
        trigger('highlightArrow', [
            transition(':leave', [
                style({ opacity: 1 }),
                animate('500ms ease-out', style({ opacity: 0 }))
            ])
        ]),
        trigger('slideInOut', [
                transition(':enter', [
                    style({transform: 'translateX(100%)'}),
                    animate('400ms ease-in-out', style({transform: 'translateX(0)'}))
                ]),
                transition(':leave', [
                    style({transform: 'translateX(0)'}),
                    animate('400ms ease-in-out', style({transform: 'translateX(100%)'}))
                ])
            ])
    ]
})
export class MainAppComponent implements OnDestroy {
    @ViewChild(SecondSideMenuContainerComponent) secondarySideMenuContainer: SecondSideMenuContainerComponent;

    showUpdateAvailable: boolean;
    updateInfo$: Observable<UpdateInfo>;
    deviceConfigurationLoaded$: Observable<boolean>;
    runningInElectron$: Observable<boolean>;
    saveToKeyboardState: ProgressButtonState;
    firstAttemptOfSaveToKeyboard$: Observable<boolean>;
    outOfSpaceWarning: OutOfSpaceWarningData;
    secondSideMenuVisible = false;

    private keypressCapturing: boolean;
    private saveToKeyboardStateSubscription: Subscription;
    private keypressCapturingSubscription: Subscription;
    private showUpdateAvailableSubscription: Subscription;
    private outOfSpaceWarningSubscription: Subscription;
    private routeDataSubscription: Subscription;
    private secondSideMenuComponent: any;

    constructor(private store: Store<AppState>,
                private route: ActivatedRoute,
                private router: Router,
                private cdRef: ChangeDetectorRef) {
        this.showUpdateAvailableSubscription = store.select(getShowAppUpdateAvailable)
            .subscribe(data => this.showUpdateAvailable = data);
        this.updateInfo$ = store.select(getUpdateInfo);
        this.deviceConfigurationLoaded$ = store.select(deviceConfigurationLoaded);
        this.runningInElectron$ = store.select(runningInElectron);
        this.saveToKeyboardStateSubscription = store.select(saveToKeyboardState)
            .subscribe(data => this.saveToKeyboardState = data);
        this.keypressCapturingSubscription = store.select(keypressCapturing)
            .subscribe(data => this.keypressCapturing = data);
        this.firstAttemptOfSaveToKeyboard$ = store.select(firstAttemptOfSaveToKeyboard);
        this.outOfSpaceWarningSubscription = store.select(getOutOfSpaceWaringData)
            .subscribe(data => this.outOfSpaceWarning = data);
        this.routeDataSubscription = this.router.events.pipe(
            filter((event: Event) => event instanceof NavigationEnd)
        ).subscribe((event: NavigationEnd) => {
            let tmpRoute = this.route.snapshot.root;
            let data = { ...tmpRoute.data };

            while (tmpRoute.firstChild) {
                tmpRoute = tmpRoute.firstChild;
                data = {
                    ...data,
                    ...tmpRoute.data
                };
            }

            if (this.secondSideMenuComponent !== data.secondMenuComponent) {
               this.secondSideMenuComponent = data.secondMenuComponent;

               if (this.secondSideMenuComponent) {
                   this.secondSideMenuVisible = true;
                   this.secondarySideMenuContainer.resolveComponent(this.secondSideMenuComponent);
               } else {
                   this.secondSideMenuVisible = false;
                   this.secondarySideMenuContainer.clear();
               }
               this.cdRef.detectChanges();
            }
        });
    }

    ngOnDestroy(): void {
        this.saveToKeyboardStateSubscription.unsubscribe();
        this.keypressCapturingSubscription.unsubscribe();
        this.showUpdateAvailableSubscription.unsubscribe();
        this.outOfSpaceWarningSubscription.unsubscribe();
        this.routeDataSubscription.unsubscribe();
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

        this.store.dispatch(new KeyDownAction(event));
    }

    @HostListener('document:keyup', ['$event'])
    onKeyUp(event: KeyboardEvent) {
        this.store.dispatch(new KeyUpAction(event));
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
