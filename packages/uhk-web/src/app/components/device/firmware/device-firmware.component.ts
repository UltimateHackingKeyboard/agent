import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { VersionInformation } from 'uhk-common';

import { AppState, flashFirmwareButtonDisbabled, getAgentVersionInfo, xtermLog } from '../../../store';
import { UpdateFirmwareAction, UpdateFirmwareWithAction } from '../../../store/actions/device';
import { XtermLog } from '../../../models/xterm-log';

@Component({
    selector: 'device-firmware',
    templateUrl: './device-firmware.component.html',
    styleUrls: ['./device-firmware.component.scss'],
    host: {
        'class': 'container-fluid'
    }
})
export class DeviceFirmwareComponent {
    flashFirmwareButtonDisbabled$: Observable<boolean>;
    xtermLog$: Observable<Array<XtermLog>>;
    getAgentVersionInfo$: Observable<VersionInformation>;
    arrayBuffer: Uint8Array;

    constructor(private store: Store<AppState>) {
        this.flashFirmwareButtonDisbabled$ = store.select(flashFirmwareButtonDisbabled);
        this.xtermLog$ = store.select(xtermLog);
        this.getAgentVersionInfo$ = store.select(getAgentVersionInfo);
    }

    onUpdateFirmware(): void {
        this.store.dispatch(new UpdateFirmwareAction());
    }

    onUpdateFirmwareWithFile(): void {
        if (!this.arrayBuffer) {
            return;
        }

        this.store.dispatch(new UpdateFirmwareWithAction(Array.prototype.slice.call(this.arrayBuffer)));
    }

    changeFile(event): void {
        const files = event.srcElement.files;
        const fileReader = new FileReader();
        fileReader.onloadend = function () {
            this.arrayBuffer = new Uint8Array(fileReader.result);
        }.bind(this);
        fileReader.readAsArrayBuffer(files[0]);
    }
}
