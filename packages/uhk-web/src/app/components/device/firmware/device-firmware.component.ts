import { ChangeDetectorRef, Component, OnDestroy, ViewChild } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import {
    faCircleExclamation,
    faCheck,
    faExclamation,
    faLongArrowAltRight,
    faSlidersH,
    faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import { FirmwareUpgradeFailReason, UhkModule, VersionInformation } from 'uhk-common';

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
import { RecoveryModuleAction, UpdateFirmwareAction, UpdateFirmwareWithAction } from '../../../store/actions/device';
import { XtermLog } from '../../../models/xterm-log';
import { XtermComponent } from '../../xterm/xterm.component';
import { FirmwareUpgradeState, ModuleFirmwareUpgradeState, ModuleFirmwareUpgradeStates, UpdateFirmwareWithPayload } from '../../../models';

@Component({
    selector: 'device-firmware',
    templateUrl: './device-firmware.component.html',
    styleUrls: ['./device-firmware.component.scss'],
    host: {
        'class': 'container-fluid full-screen-component'
    }
})
export class DeviceFirmwareComponent implements OnDestroy {
    flashFirmwareButtonDisabled$: Observable<boolean>;
    xtermLog$: Observable<Array<XtermLog>>;
    getAgentVersionInfo$: Observable<VersionInformation>;
    firmwareUpgradeStates: FirmwareUpgradeState;
    runningOnNotSupportedWindows$: Observable<boolean>;
    firmwareUpgradeAllowed$: Observable<boolean>;

    firmwareUpgradeFailed: boolean;
    firmwareUpgradeFailReasons = FirmwareUpgradeFailReason;
    firmwareUpgradeSuccess: boolean;
    upgradeType = 'Firmware';

    @ViewChild(XtermComponent, { static: false }) xtermRef: XtermComponent;

    faCircleExclamation = faCircleExclamation;
    faLongArrowAltRight = faLongArrowAltRight;
    faSlidersH = faSlidersH;
    faSpinner = faSpinner;
    faCheck = faCheck;
    faExclamation = faExclamation;

    private subscription = new Subscription();

    constructor(private store: Store<AppState>,
                private cdRef: ChangeDetectorRef,
                private sanitizer: DomSanitizer) {
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
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    onUpdateFirmware(): void {
        if (this.firmwareUpgradeStates?.showForceFirmwareUpgrade) {
            return;
        }

        this.upgradeType = 'Firmware';
        this.store.dispatch(new UpdateFirmwareAction(false));
    }

    onForceUpgradeFirmware(): void {
        this.upgradeType = 'Firmware';
        this.store.dispatch(new UpdateFirmwareAction(true));
    }

    changeFile(data: UpdateFirmwareWithPayload): void {
        this.upgradeType = 'Firmware';
        this.store.dispatch(new UpdateFirmwareWithAction(data));
    }

    firmwareUpgradeStateTrackByFn(index: number, module: ModuleFirmwareUpgradeState): string {
        return module.moduleName;
    }

    recoveryModule(moduleId: number): void {
        this.upgradeType = 'Module';
        this.store.dispatch(new RecoveryModuleAction(moduleId));
    }

    trackByRecoveryModuleFn(index: number, key: UhkModule): string {
        return key.id.toString();
    }

    gitTagText(currentFirmwareVersion: string, gitTag: string): string {
        const tag = gitTag?.startsWith('v') ? gitTag.substring(1) : gitTag;

        if (tag === currentFirmwareVersion)
            return '';

        return '#' + gitTag;
    }

    checksumTooltip(upgradeState: ModuleFirmwareUpgradeState): SafeHtml {
        return this.sanitizer.bypassSecurityTrustHtml(this.calculateChecksumTooltip(upgradeState));
    }

    private calculateChecksumTooltip(upgradeState: ModuleFirmwareUpgradeState): string {
        if (upgradeState.state === ModuleFirmwareUpgradeStates.Upgrading) {
            if (upgradeState.forceUpgraded) {
                return `Force upgrading, even though expected checksum (${upgradeState.newFirmwareChecksum}) is equal with actual (${upgradeState.currentFirmwareChecksum})`
            }
            else {
                return `Upgrading, because expected checksum (${upgradeState.newFirmwareChecksum}) is not equal with actual (${upgradeState.currentFirmwareChecksum})`
            }
        }
        else if (upgradeState.state === ModuleFirmwareUpgradeStates.Skipped) {
            return `Not upgraded, because expected checksum (${upgradeState.newFirmwareChecksum}) was equal with actual (${upgradeState.currentFirmwareChecksum})`
        }
        else if (upgradeState.state === ModuleFirmwareUpgradeStates.Success) {
            if (upgradeState.forceUpgraded) {
                return `Force upgraded, even though expected checksum (${upgradeState.newFirmwareChecksum}) was equal with actual (${upgradeState.currentFirmwareChecksum})`
            }
            else {
                return `Upgraded, because expected checksum (${upgradeState.newFirmwareChecksum}) was not equal with actual (${upgradeState.currentFirmwareChecksum})`
            }
        }
        else if (upgradeState.state === ModuleFirmwareUpgradeStates.Failed) {
            if (upgradeState.forceUpgraded) {
                return `Force upgrade failed, expected checksum (${upgradeState.newFirmwareChecksum}) is equal with actual (${upgradeState.currentFirmwareChecksum})`
            }
            else {
                return `Upgrade failed, expected checksum (${upgradeState.newFirmwareChecksum}) is not equal with actual (${upgradeState.currentFirmwareChecksum})`
            }
        }

        return ''
    }

    private scrollToTheEndOfTheLogs(): void {
        if (this.xtermRef) {
            this.xtermRef.scrollToTheEnd();
        }
    }
}
