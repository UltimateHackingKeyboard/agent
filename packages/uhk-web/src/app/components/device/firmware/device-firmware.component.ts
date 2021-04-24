import { ChangeDetectorRef, Component, OnDestroy, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { faSlidersH, faSpinner, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { Constants, UploadFileData, VersionInformation } from 'uhk-common';

import {
    AppState,
    firmwareUpgradeAllowed,
    firmwareUpgradeFailed,
    firmwareUpgradeSuccess,
    flashFirmwareButtonDisabled,
    getAgentVersionInfo,
    getFirmwareUpgradeState,
    runningOnNotSupportedWindows,
    xtermLog
} from '../../../store';
import { UpdateFirmwareAction, UpdateFirmwareWithAction } from '../../../store/actions/device';
import { XtermLog } from '../../../models/xterm-log';
import { XtermComponent } from '../../xterm/xterm.component';
import { FirmwareUpgradeState, ModuleFirmwareUpgradeState, UpdateFirmwareWithPayload } from '../../../models';

@Component({
    selector: 'device-firmware',
    templateUrl: './device-firmware.component.html',
    styleUrls: ['./device-firmware.component.scss'],
    host: {
        'class': 'container-fluid'
    }
})
export class DeviceFirmwareComponent implements OnDestroy {
    flashFirmwareButtonDisabled$: Observable<boolean>;
    xtermLog$: Observable<Array<XtermLog>>;
    getAgentVersionInfo$: Observable<VersionInformation>;
    firmwareUpgradeStates: FirmwareUpgradeState;
    runningOnNotSupportedWindows$: Observable<boolean>;
    firmwareUpgradeAllowed$: Observable<boolean>;

    firmwareGithubIssueUrl: string;
    firmwareUpgradeFailed: boolean;
    firmwareUpgradeSuccess: boolean;

    @ViewChild(XtermComponent, { static: false })
    xtermRef: XtermComponent;

    faArrowRight = faArrowRight;
    faSlidersH = faSlidersH;
    faSpinner = faSpinner;

    private subscription = new Subscription();

    constructor(private store: Store<AppState>,
                private cdRef: ChangeDetectorRef) {
        this.flashFirmwareButtonDisabled$ = store.select(flashFirmwareButtonDisabled);
        this.xtermLog$ = store.select(xtermLog);
        this.getAgentVersionInfo$ = store.select(getAgentVersionInfo);
        this.subscription.add(store.select(getFirmwareUpgradeState).subscribe(data => {
            this.firmwareUpgradeStates = data;
            this.cdRef.markForCheck();
        }));
        this.runningOnNotSupportedWindows$ = store.select(runningOnNotSupportedWindows);
        this.firmwareUpgradeAllowed$ = store.select(firmwareUpgradeAllowed);
        this.subscription.add(store.select(firmwareUpgradeFailed).subscribe(data => {
            this.firmwareUpgradeFailed = data;
            this.scrollToTheEndOfTheLogs();
        }));
        this.subscription.add(store.select(firmwareUpgradeSuccess).subscribe(data => {
            this.firmwareUpgradeSuccess = data;
            this.scrollToTheEndOfTheLogs();
        }));
        this.firmwareGithubIssueUrl = Constants.FIRMWARE_GITHUB_ISSUE_URL;
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    onUpdateFirmware(): void {
        if (this.firmwareUpgradeStates?.showForceFirmwareUpgrade) {
            return;
        }

        this.store.dispatch(new UpdateFirmwareAction(false));
    }

    onForceUpgradeFirmware(): void {
        this.store.dispatch(new UpdateFirmwareAction(true));
    }

    changeFile(data: UpdateFirmwareWithPayload): void {
        this.store.dispatch(new UpdateFirmwareWithAction(data));
    }

    firmwareUpgradeStateTrackByFn(index: number, module: ModuleFirmwareUpgradeState): string {
        return module.moduleName;
    }

    private scrollToTheEndOfTheLogs(): void {
        if (this.xtermRef) {
            this.xtermRef.scrollToTheEnd();
        }
    }
}
