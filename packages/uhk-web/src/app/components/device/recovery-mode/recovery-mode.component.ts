import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

import { XtermLog } from '../../../models/xterm-log';
import { AppState, firmwareOkButtonDisabled, flashFirmwareButtonDisbabled, xtermLog } from '../../../store';
import { RecoveryDeviceAction, UpdateFirmwareOkButtonAction } from '../../../store/actions/device';

@Component({
    selector: 'device-recovery-mode',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './recovery-mode.component.html',
    styleUrls: ['./recovery-mode.component.scss'],
    host: {
        'class': 'container-fluid'
    }
})
export class RecoveryModeComponent implements OnInit, OnDestroy {
    xtermLogSubscription: Subscription;
    flashFirmwareButtonDisbabled$: Observable<boolean>;
    firmwareOkButtonDisabled$: Observable<boolean>;

    xtermLog: Array<XtermLog>;

    @ViewChild('scrollMe') divElement: ElementRef;

    constructor(private store: Store<AppState>,
                private cdRef: ChangeDetectorRef) {
    }

    ngOnInit(): void {
        this.flashFirmwareButtonDisbabled$ = this.store.select(flashFirmwareButtonDisbabled);
        this.firmwareOkButtonDisabled$ = this.store.select(firmwareOkButtonDisabled);
        this.xtermLogSubscription = this.store.select(xtermLog)
            .subscribe(data => {
                this.xtermLog = data;

                this.cdRef.markForCheck();

                if (this.divElement && this.divElement.nativeElement) {
                    setTimeout(() => {
                        this.divElement.nativeElement.scrollTop = this.divElement.nativeElement.scrollHeight;
                    });
                }
            });
    }

    ngOnDestroy(): void {
        if (this.xtermLogSubscription) {
            this.xtermLogSubscription.unsubscribe();
        }
    }

    onRecoveryDevice(): void {
        this.store.dispatch(new RecoveryDeviceAction());
    }

    onOkButtonClick(): void {
        this.store.dispatch(new UpdateFirmwareOkButtonAction());
    }
}
