import { Component, HostListener, OnDestroy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Event, NavigationEnd, Router } from '@angular/router';
import { animate, style, transition, trigger } from '@angular/animations';
import { NotifierService } from '@ert78gb/angular-notifier';
import { faPuzzlePiece, faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { Actions, ofType } from '@ngrx/effects';
import { SplitGutterInteractionEvent } from 'angular-split';
import { Observable, Subscription } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import { ERR_UPDATER_INVALID_SIGNATURE } from 'uhk-common';

import { KeyboardSvgExportService } from './services/keyboard-svg-export.service';
import { ActionTypes as AppUpdateActionTypes } from './store/actions/app-update.action';
import { DoNotUpdateAppAction, UpdateAppAction } from './store/actions/app-update.action';
import { EnableUsbStackTestAction, UpdateFirmwareAction } from './store/actions/device';
import {
    AppState,
    getDonglePairingState,
    getNewPairedDevicesState,
    getErrorPanelHeight,
    getShowAppUpdateAvailable,
    getParsedStatusBuffer,
    deviceConfigurationLoaded,
    runningInElectron,
    saveToKeyboardState,
    keypressCapturing,
    getUpdateInfo,
    firstAttemptOfSaveToKeyboard,
    isStatusBufferErrorHidden,
    getOutOfSpaceWaringData,
    getShowFirmwareUpgradePanel
} from './store';
import { StartDonglePairingAction } from './store/actions/dongle-pairing.action';
import { AddNewPairedDevicesToHostConnectionsAction } from './store/actions/user-config';
import { ProgressButtonState } from './store/reducers/progress-button-state';
import { UpdateInfo } from './models/update-info';
import {
    CloseErrorPanelAction,
    ShowErrorPanelAction,
    ErrorPanelSizeChangedAction,
    KeyUpAction,
    KeyDownAction,
} from './store/actions/app';
import { BleAddingState, DonglePairingState, OutOfSpaceWarningData } from './models';
import { filter } from 'rxjs/operators';
import { SecondSideMenuContainerComponent } from './components/side-menu';

@Component({
    selector: 'main-app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: false,
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
        trigger('topNotificationPanelVisible', [
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
        trigger('errorPanel', [
            transition(':leave', [
                style({ height: '*' }),
                animate('300ms ease-out', style({ height: 0 }))
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
    ],
})
export class MainAppComponent implements OnDestroy {
    @ViewChild(SecondSideMenuContainerComponent) secondarySideMenuContainer: SecondSideMenuContainerComponent;
    @ViewChild('manuallyUpdateNotification', { static: true }) manuallyUpdateNotificationTmpl;

    donglePairingState: DonglePairingState;
    newPairedDevicesState: BleAddingState;
    showFirmwareUpgradePanel: boolean;
    showUpdateAvailable: boolean;
    updateInfo$: Observable<UpdateInfo>;
    deviceConfigurationLoaded$: Observable<boolean>;
    runningInElectron$: Observable<boolean>;
    saveToKeyboardState: ProgressButtonState;
    firstAttemptOfSaveToKeyboard$: Observable<boolean>;
    isStatusBufferErrorHidden$: Observable<boolean>;
    outOfSpaceWarning: OutOfSpaceWarningData;
    secondSideMenuVisible = false;
    splitSizes = {
        top: 100,
        bottom: 0
    };
    statusBuffer: string;
    private actionsSubscription: Subscription;
    private donglePairingStateSubscription: Subscription;
    private newPairedDevicesStateSubscription: Subscription;
    private errorPanelHeightSubscription: Subscription;
    private keypressCapturing: boolean;
    private saveToKeyboardStateSubscription: Subscription;
    private keypressCapturingSubscription: Subscription;
    private showFirmwareUpgradePanelSubscription: Subscription;
    private showUpdateAvailableSubscription: Subscription;
    private outOfSpaceWarningSubscription: Subscription;
    private routeDataSubscription: Subscription;
    private statusBufferSubscription: Subscription;
    private secondSideMenuComponent: any;

    constructor(private store: Store<AppState>,
                private route: ActivatedRoute,
                private router: Router,
                private cdRef: ChangeDetectorRef,
                private actions$: Actions,
                private keyboardSvgExportService: KeyboardSvgExportService,
                private notificationService: NotifierService,
        ) {
        this.actionsSubscription = actions$.pipe(
            ofType(AppUpdateActionTypes.InvalidCodesignSignature)
        )
        .subscribe(() => {
            notificationService.show({
                message: '',
                type: 'info',
                template: this.manuallyUpdateNotificationTmpl,
                id: ERR_UPDATER_INVALID_SIGNATURE,
            })
        })

        this.donglePairingStateSubscription = store.select(getDonglePairingState)
            .subscribe(data => {
                this.donglePairingState = data;
                this.cdRef.markForCheck();
            });
        this.newPairedDevicesStateSubscription = store.select(getNewPairedDevicesState)
            .subscribe(data => {
                this.newPairedDevicesState = data;
                this.cdRef.markForCheck();
            });
        this.errorPanelHeightSubscription = store.select(getErrorPanelHeight)
            .subscribe(height => {
                this.splitSizes = {
                    top: 100 - height,
                    bottom: height
                };
                this.cdRef.markForCheck();
            });
        this.showFirmwareUpgradePanelSubscription = store.select(getShowFirmwareUpgradePanel)
            .subscribe(data => {
                this.showFirmwareUpgradePanel = data;
                this.cdRef.markForCheck();
            });
        this.showUpdateAvailableSubscription = store.select(getShowAppUpdateAvailable)
            .subscribe(data => {
                this.showUpdateAvailable = data;
                this.cdRef.markForCheck();
            });
        this.updateInfo$ = store.select(getUpdateInfo);
        this.deviceConfigurationLoaded$ = store.select(deviceConfigurationLoaded);
        this.runningInElectron$ = store.select(runningInElectron);
        this.saveToKeyboardStateSubscription = store.select(saveToKeyboardState)
            .subscribe(data => this.saveToKeyboardState = data);
        this.keypressCapturingSubscription = store.select(keypressCapturing)
            .subscribe(data => this.keypressCapturing = data);
        this.firstAttemptOfSaveToKeyboard$ = store.select(firstAttemptOfSaveToKeyboard);
        this.isStatusBufferErrorHidden$ = store.select(isStatusBufferErrorHidden);
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
        this.statusBufferSubscription = store.select(getParsedStatusBuffer)
            .subscribe(data => {
                this.statusBuffer = data;
                this.cdRef.markForCheck();
            });
    }

    ngOnDestroy(): void {
        this.actionsSubscription.unsubscribe();
        this.donglePairingStateSubscription.unsubscribe();
        this.newPairedDevicesStateSubscription.unsubscribe();
        this.errorPanelHeightSubscription.unsubscribe();
        this.saveToKeyboardStateSubscription.unsubscribe();
        this.keypressCapturingSubscription.unsubscribe();
        this.showFirmwareUpgradePanelSubscription.unsubscribe();
        this.showUpdateAvailableSubscription.unsubscribe();
        this.outOfSpaceWarningSubscription.unsubscribe();
        this.routeDataSubscription.unsubscribe();
        this.statusBufferSubscription.unsubscribe();
    }

    @HostListener('document:keydown', ['$event'])
    onKeyDown(event: KeyboardEvent) {
        // It should be before the CTRL + S to prevent the conflict with the SaveToKeyboard shortcut
        if (event.ctrlKey &&
            event.altKey &&
            event.shiftKey &&
            event.code === 'KeyS' &&
            !event.defaultPrevented &&
            !this.keypressCapturing) {
            this.keyboardSvgExportService.downloadSvgKeyboard();
            event.preventDefault();
        }

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

    errorPanelSizeDragEndHandler($event: SplitGutterInteractionEvent) {
        this.store.dispatch(new ErrorPanelSizeChangedAction($event.sizes[1] as number));
    }

    @HostListener('document:keyup', ['$event'])
    onKeyUp(event: KeyboardEvent) {
        this.store.dispatch(new KeyUpAction(event));
    }

    addPairedDevicesToHostConnections() {
        this.store.dispatch(new AddNewPairedDevicesToHostConnectionsAction());
    }

    closeErrorPanel(): void {
        this.store.dispatch(new CloseErrorPanelAction());
    }

    dismissUpdateErrorNotification(): void {
        this.notificationService.hide(ERR_UPDATER_INVALID_SIGNATURE);
    }

    showErrorPanel(): void {
        this.store.dispatch(new ShowErrorPanelAction());
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

    isTopNotificationPanelVisible(): boolean {
        return this.showFirmwareUpgradePanel
            || this.showUpdateAvailable
            || this.donglePairingState?.showDonglePairingPanel
            || this.newPairedDevicesState?.showNewPairedDevicesPanel;
    }

    updateFirmware(): void {
        this.store.dispatch(new UpdateFirmwareAction(false));
    }

    startDonglePairing(): void {
        this.store.dispatch(new StartDonglePairingAction());
    }

    protected readonly faPuzzlePiece = faPuzzlePiece;
    protected readonly faArrowUp = faArrowUp;
}
