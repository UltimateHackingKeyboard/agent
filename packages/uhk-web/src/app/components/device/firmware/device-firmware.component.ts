import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { VersionInformation } from 'uhk-common';

import { AppState, firmwareOkButtonDisabled, flashFirmwareButtonDisbabled, getAgentVersionInfo, xtermLog } from '../../../store';
import { UpdateFirmwareAction, UpdateFirmwareOkButtonAction, UpdateFirmwareWithAction } from '../../../store/actions/device';
import { XtermLog } from '../../../models/xterm-log';

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
    xtermLogSubscription: Subscription;
    getAgentVersionInfo$: Observable<VersionInformation>;
    firmwareOkButtonDisabled$: Observable<boolean>;

    @ViewChild('scrollMe') divElement: ElementRef;

    constructor(private store: Store<AppState>) {
        this.flashFirmwareButtonDisbabled$ = store.select(flashFirmwareButtonDisbabled);
        this.xtermLog$ = store.select(xtermLog);
        this.xtermLogSubscription = this.xtermLog$.subscribe(() => {
            if (this.divElement && this.divElement.nativeElement) {
                setTimeout(() => {
                    this.divElement.nativeElement.scrollTop = this.divElement.nativeElement.scrollHeight;
                });
            }
        });
        this.getAgentVersionInfo$ = store.select(getAgentVersionInfo);
        this.firmwareOkButtonDisabled$ = store.select(firmwareOkButtonDisabled);
    }

    ngOnDestroy(): void {
        this.xtermLogSubscription.unsubscribe();
    }

    onUpdateFirmware(): void {
        this.store.dispatch(new UpdateFirmwareAction());
    }

    onOkButtonClick(): void {
        this.store.dispatch(new UpdateFirmwareOkButtonAction());
    }

    changeFile(event): void {
        const files = event.srcElement.files;

        if (files.length === 0) {
            return;
        }

        const fileReader = new FileReader();
        fileReader.onloadend = function () {
            const arrayBuffer = new Uint8Array(fileReader.result);
            this.store.dispatch(new UpdateFirmwareWithAction(Array.prototype.slice.call(arrayBuffer)));
        }.bind(this);
        fileReader.readAsArrayBuffer(files[0]);
    }

    openFileDialog(): void {
        document.getElementById('firmware-file-select').click();
    }
}
