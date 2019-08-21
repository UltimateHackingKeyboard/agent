import { Component, OnDestroy, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { Constants, HardwareModules, VersionInformation } from 'uhk-common';

import {
    AppState,
    firmwareUpgradeAllowed,
    firmwareUpgradeFailed,
    firmwareUpgradeSuccess,
    flashFirmwareButtonDisbabled,
    getAgentVersionInfo,
    getHardwareModules,
    runningOnNotSupportedWindows,
    xtermLog
} from '../../../store';
import { UpdateFirmwareAction, UpdateFirmwareWithAction } from '../../../store/actions/device';
import { XtermLog } from '../../../models/xterm-log';
import { UploadFileData } from '../../../models/upload-file-data';
import { XtermComponent } from '../../xterm/xterm.component';

@Component({
    selector: 'device-firmware',
    templateUrl: './device-firmware.component.html',
    styleUrls: ['./device-firmware.component.scss'],
    host: {
        'class': 'container-fluid'
    }
})
export class DeviceFirmwareComponent implements OnDestroy {
    flashFirmwareButtonDisbabled$: Observable<boolean>;
    xtermLog$: Observable<Array<XtermLog>>;
    getAgentVersionInfo$: Observable<VersionInformation>;
    hardwareModules: HardwareModules;
    runningOnNotSupportedWindows$: Observable<boolean>;
    firmwareUpgradeAllowed$: Observable<boolean>;

    firmwareGithubIssueUrl: string;
    firmwareUpgradeFailed: boolean;
    firmwareUpgradeSuccess: boolean;

    @ViewChild(XtermComponent, { static: false })
    xtermRef: XtermComponent;

    private subscription = new Subscription();

    constructor(private store: Store<AppState>) {
        this.flashFirmwareButtonDisbabled$ = store.select(flashFirmwareButtonDisbabled);
        this.xtermLog$ = store.select(xtermLog);
        this.getAgentVersionInfo$ = store.select(getAgentVersionInfo);
        this.subscription.add(store.select(getHardwareModules).subscribe(data => {
            this.hardwareModules = data;
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
        this.store.dispatch(new UpdateFirmwareAction());
    }

    changeFile(data: UploadFileData): void {
        this.store.dispatch(new UpdateFirmwareWithAction(data.data));
    }

    private scrollToTheEndOfTheLogs(): void {
        if (this.xtermRef) {
            this.xtermRef.scrollToTheEnd();
        }
    }
}
