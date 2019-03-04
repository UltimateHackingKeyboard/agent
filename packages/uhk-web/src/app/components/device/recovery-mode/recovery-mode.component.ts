import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { XtermLog } from '../../../models/xterm-log';
import { AppState, flashFirmwareButtonDisbabled, updatingFirmware, xtermLog } from '../../../store';
import { RecoveryDeviceAction, StartConnectionPollerAction } from '../../../store/actions/device';

@Component({
    selector: 'device-recovery-mode',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './recovery-mode.component.html',
    styleUrls: ['./recovery-mode.component.scss'],
    host: {
        'class': 'container-fluid'
    }
})
export class RecoveryModeComponent implements OnInit {
    flashFirmwareButtonDisbabled$: Observable<boolean>;
    updatingFirmware$: Observable<boolean>;

    xtermLog$: Observable<Array<XtermLog>>;

    constructor(private store: Store<AppState>) {
    }

    ngOnInit(): void {
        this.flashFirmwareButtonDisbabled$ = this.store.select(flashFirmwareButtonDisbabled);
        this.updatingFirmware$ = this.store.select(updatingFirmware);
        this.xtermLog$ = this.store.select(xtermLog);
    }

    onRecoveryDevice(): void {
        this.store.dispatch(new RecoveryDeviceAction());
    }

    onClose(): void {
        this.store.dispatch(new StartConnectionPollerAction());
    }
}
