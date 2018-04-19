import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';

import { XtermLog } from '../../../models/xterm-log';
import { AppState, xtermLog } from '../../../store';
import { RecoveryDeviceAction } from '../../../store/actions/device';

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

    xtermLog: Array<XtermLog>;

    @ViewChild('scrollMe') divElement: ElementRef;

    constructor(private store: Store<AppState>,
                private cdRef: ChangeDetectorRef) {
    }

    ngOnInit(): void {
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
}
