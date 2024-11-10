import { ChangeDetectorRef, ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { faWrench } from '@fortawesome/free-solid-svg-icons';

import { RecoverPageState } from '../../../models/recover-page-state';
import { XtermLog } from '../../../models/xterm-log';
import { AppState, flashFirmwareButtonDisabled, getRecoveryPageState, xtermLog } from '../../../store';
import { RecoveryDeviceAction } from '../../../store/actions/device';

@Component({
    selector: 'device-recovery-mode',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './recovery-mode.component.html',
    styleUrls: ['./recovery-mode.component.scss'],
    host: {
        'class': 'container-fluid full-screen-component'
    }
})
export class RecoveryModeComponent implements OnDestroy, OnInit {
    flashFirmwareButtonDisabled$: Observable<boolean>;

    recoverPageState: RecoverPageState;

    xtermLog$: Observable<Array<XtermLog>>;
    faWrench = faWrench;

    private recoverPageStateSubscription: Subscription;

    constructor(private cdRef: ChangeDetectorRef,
                private store: Store<AppState>) {
    }

    ngOnDestroy(): void {
        this.recoverPageStateSubscription?.unsubscribe();
    }

    ngOnInit(): void {
        this.flashFirmwareButtonDisabled$ = this.store.select(flashFirmwareButtonDisabled);
        this.recoverPageStateSubscription = this.store.select(getRecoveryPageState)
            .subscribe((recoverPageState) => {
                this.recoverPageState = recoverPageState;
                this.cdRef.detectChanges();
            });
        this.xtermLog$ = this.store.select(xtermLog);
    }

    onRecoveryDevice(): void {
        this.store.dispatch(new RecoveryDeviceAction(this.recoverPageState.deviceId));
    }
}
