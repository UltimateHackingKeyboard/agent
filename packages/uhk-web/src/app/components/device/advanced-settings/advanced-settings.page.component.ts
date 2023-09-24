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
import { KeyboardLayout } from 'uhk-common';

import { ToggleI2cDebuggingAction, ToggleI2cDebuggingRingBellAction } from '../../../store/actions/advance-settings.action';
import { advanceSettingsState, AppState, getKeyboardLayout, isKeyboardLayoutChanging } from '../../../store';
import { ChangeKeyboardLayoutAction } from '../../../store/actions/device';
import { initialState, State } from '../../../store/reducers/advanced-settings.reducer';

@Component({
    selector: 'advanced-settings',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: 'advanced-settings.page.component.html',
    host: {
        'class': 'container-fluid full-screen-component'
    }
})
export class AdvancedSettingsPageComponent implements OnInit, OnDestroy {
    faCog = faCog;

    @ViewChild('audioPlayer', {static: true,}) audioPlayer: ElementRef<HTMLAudioElement>;

    isKeyboardLayoutChanging$: Observable<boolean>;
    keyboardLayout: KeyboardLayout;
    keyboardLayoutEnum = KeyboardLayout;

    state: State;

    private i2cErrorsLength = 0;
    private stateSubscription: Subscription;
    private keyboardLayoutSubscription: Subscription;

    constructor(private store: Store<AppState>,
                private cdRef: ChangeDetectorRef) {
        this.state = initialState();
        this.isKeyboardLayoutChanging$ = this.store.select(isKeyboardLayoutChanging);
    }

    ngOnDestroy(): void {
        if(this.keyboardLayoutSubscription) {
            this.keyboardLayoutSubscription.unsubscribe();
        }

        if (this.stateSubscription) {
            this.stateSubscription.unsubscribe();
        }
    }

    ngOnInit(): void {
        this.keyboardLayoutSubscription = this.store.select(getKeyboardLayout)
            .subscribe(layout => {
                this.keyboardLayout = layout;
                this.cdRef.detectChanges();
            });

        this.stateSubscription = this.store.select(advanceSettingsState)
            .subscribe(state => {
                this.state = state;
                this.cdRef.detectChanges();
                if (this.audioPlayer && this.state.i2cDebuggingRingBellEnabled && this.i2cErrorsLength !== this.state.i2cLogs.length) {
                    this.i2cErrorsLength = this.state.i2cLogs.length;
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
}
