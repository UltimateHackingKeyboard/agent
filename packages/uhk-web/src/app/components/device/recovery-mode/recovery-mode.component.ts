import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { XtermLog } from '../../../models/xterm-log';
import { AppState, flashFirmwareButtonDisbabled, xtermLog } from '../../../store';
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
export class RecoveryModeComponent implements OnInit {
    flashFirmwareButtonDisbabled$: Observable<boolean>;

    xtermLog$: Observable<Array<XtermLog>>;

    constructor(private store: Store<AppState>) {
    }

    ngOnInit(): void {
        this.flashFirmwareButtonDisbabled$ = this.store.select(flashFirmwareButtonDisbabled);
        this.xtermLog$ = this.store.select(xtermLog);
    }

    onRecoveryDevice(): void {
        this.store.dispatch(new RecoveryDeviceAction());
    }
}
