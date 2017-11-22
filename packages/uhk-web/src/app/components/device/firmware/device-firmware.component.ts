import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { AppState, updatingFirmware } from '../../../store';
import { UpdateFirmwareAction, UpdateFirmwareWithAction } from '../../../store/actions/device';

@Component({
    selector: 'device-firmware',
    templateUrl: './device-firmware.component.html',
    styleUrls: ['./device-firmware.component.scss'],
    host: {
        'class': 'container-fluid'
    }
})
export class DeviceFirmwareComponent {
    updatingFirmware$: Observable<boolean>;
    arrayBuffer: Uint8Array;

    constructor(private store: Store<AppState>) {
        this.updatingFirmware$ = store.select(updatingFirmware);
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
