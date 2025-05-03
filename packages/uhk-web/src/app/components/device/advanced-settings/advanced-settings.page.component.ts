import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    OnDestroy,
    OnInit,
    ViewChild
} from '@angular/core';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { KeyboardLayout, UHK_60_DEVICE, UHK_60_V2_DEVICE, UHK_80_DEVICE } from 'uhk-common';

import {
    IsDongleZephyrLoggingEnabledAction,
    IsLeftHalfZephyrLoggingEnabledAction,
    IsRightHalfZephyrLoggingEnabledAction,
    ToggleDongleZephyrLoggingAction,
    ToggleLeftHalfZephyrLoggingAction,
    ToggleRightHalfZephyrLoggingAction,
    ToggleI2cDebuggingAction,
    ToggleI2cDebuggingRingBellAction,
    ToggleZephyrLoggingAction,
    StartLeftHalfPairingAction,
} from '../../../store/actions/advance-settings.action';
import {
    advanceSettingsState,
    AppState,
    getConnectedDevice,
    getDongle,
    getKeyboardLayout,
    getLeftHalfDetected,
    isKeyboardLayoutChanging,
} from '../../../store';
import { ChangeKeyboardLayoutAction } from '../../../store/actions/device';
import { ActiveButton, initialState, State } from '../../../store/reducers/advanced-settings.reducer';

@Component({
    selector: 'advanced-settings',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: 'advanced-settings.page.component.html',
    host: {
        'class': 'container-fluid full-screen-component'
    }
})
export class AdvancedSettingsPageComponent implements OnInit, OnDestroy {
    ActiveButton = ActiveButton;
    faCog = faCog;

    @ViewChild('audioPlayer', {static: true,}) audioPlayer: ElementRef<HTMLAudioElement>;

    isKeyboardLayoutChanging$: Observable<boolean>;
    isHalvesPairingAllowed: boolean;
    isZephyrLoggingAllowed: boolean;
    keyboardLayout: KeyboardLayout;
    keyboardLayoutEnum = KeyboardLayout;
    showDongleZephyrLogCheckbox: boolean;
    showI2CRecoverButton: boolean;
    showLeftHalfZephyrLogCheckbox: boolean;
    state: State;

    private i2cErrorsLength = 0;
    private stateSubscription: Subscription;
    private connectedDeviceSubscription: Subscription;
    private dongleSubscription: Subscription;
    private keyboardLayoutSubscription: Subscription;
    private leftHalfDetectedSubscription: Subscription;

    constructor(private store: Store<AppState>,
                private cdRef: ChangeDetectorRef) {
        this.state = initialState();
        this.isKeyboardLayoutChanging$ = this.store.select(isKeyboardLayoutChanging);
    }

    ngOnDestroy(): void {
        this.connectedDeviceSubscription?.unsubscribe();
        this.dongleSubscription?.unsubscribe();
        if(this.keyboardLayoutSubscription) {
            this.keyboardLayoutSubscription.unsubscribe();
        }
        this.leftHalfDetectedSubscription?.unsubscribe();
        if (this.stateSubscription) {
            this.stateSubscription.unsubscribe();
        }
    }

    ngOnInit(): void {
        this.store.dispatch(new IsRightHalfZephyrLoggingEnabledAction())
        this.store.dispatch(new IsLeftHalfZephyrLoggingEnabledAction())
        this.store.dispatch(new IsDongleZephyrLoggingEnabledAction())

        this.connectedDeviceSubscription = this.store.select(getConnectedDevice)
            .subscribe(connectedDevice => {
                this.isHalvesPairingAllowed = connectedDevice?.id === UHK_80_DEVICE.id;
                this.isZephyrLoggingAllowed = connectedDevice?.id === UHK_80_DEVICE.id;
                this.showI2CRecoverButton = connectedDevice?.id === UHK_60_DEVICE.id ||  connectedDevice?.id === UHK_60_V2_DEVICE.id;
                this.cdRef.detectChanges();
            });
        this.dongleSubscription = this.store.select(getDongle)
            .subscribe(dongle => {
                this.showDongleZephyrLogCheckbox = !!dongle.serialNumber;
                this.cdRef.detectChanges();
            })
        this.keyboardLayoutSubscription = this.store.select(getKeyboardLayout)
            .subscribe(layout => {
                this.keyboardLayout = layout;
                this.cdRef.detectChanges();
            });
        this.leftHalfDetectedSubscription = this.store.select(getLeftHalfDetected)
            .subscribe(leftHalfDetected => {
                this.showLeftHalfZephyrLogCheckbox = leftHalfDetected;
                this.cdRef.detectChanges();
            });
        this.stateSubscription = this.store.select(advanceSettingsState)
            .subscribe(state => {
                this.state = state;
                this.cdRef.detectChanges();
                if (this.audioPlayer && this.state.i2cDebuggingRingBellEnabled && this.i2cErrorsLength !== this.state.i2cLogs.length) {
                    this.i2cErrorsLength = this.state.i2cLogs.length;
                    const audioPlayer =  this.audioPlayer.nativeElement;
                    if (audioPlayer.duration > 0 && !audioPlayer.paused) {
                        audioPlayer.pause();
                        audioPlayer.currentTime = 0;
                    }

                    this.audioPlayer.nativeElement.play();
                }
            });
    }

    onChangeKeyboardLayout(layout: KeyboardLayout): void {
        if (this.keyboardLayout === layout) {
            return;
        }

        this.store.dispatch(new ChangeKeyboardLayoutAction(layout));
    }

    onToggleI2cDebug(): void {
        this.store.dispatch(new ToggleI2cDebuggingAction());
    }

    onToggleI2cDebugRingBell(): void {
        this.store.dispatch(new ToggleI2cDebuggingRingBellAction());
    }

    onToggleZephyrLogging(): void {
        this.store.dispatch(new ToggleZephyrLoggingAction());
    }

    onToggleDongleZephyrLogging(): void {
        this.store.dispatch(new ToggleDongleZephyrLoggingAction());
    }

    onToggleLeftHalfZephyrLogging(): void {
        this.store.dispatch(new ToggleLeftHalfZephyrLoggingAction());
    }

    onToggleRightHalfZephyrLogging(): void {
        this.store.dispatch(new ToggleRightHalfZephyrLoggingAction());
    }

    startLeftHalfPairing(): void {
        this.store.dispatch(new StartLeftHalfPairingAction());
    }
}
