import {
    ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnChanges, Output,
    SimpleChanges,
    ViewChild
} from '@angular/core';
import { UploadFileData } from 'uhk-common';
import { UpdateFirmwareWithPayload } from '../../../models';

@Component({
    selector: 'firmware-file-upload',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './firmware-file-upload.component.html',
    styleUrls: ['./firmware-file-upload.component.scss']
})
export class FirmwareFileUploadComponent {

    @Input() showPopover: boolean;
    @Input() disabled: boolean;

    @Output() fileChanged = new EventEmitter<UpdateFirmwareWithPayload>();
    @ViewChild('inputControl', { static: true }) fileUpload: ElementRef<HTMLInputElement>;

    private _uploadFileData: UploadFileData;

    changeFile(event): void {
        const files = event.srcElement.files;

        if (files.length === 0) {
            return;
        }

        const fileReader = new FileReader();
        fileReader.onloadend = () => {
            const arrayBuffer = new Uint8Array(fileReader.result as ArrayBuffer);
            const target = event.target || event.srcElement || event.currentTarget;
            this._uploadFileData = {
                filename: target.value,
                data: Array.from(arrayBuffer),
                saveInHistory: false
            };
            this.fileChanged.emit({
                forceUpgrade: false,
                uploadFileData: this._uploadFileData
            });

            target.value = null;
        };
        fileReader.readAsArrayBuffer(files[0]);
    }

    onClick(): void {
        if (this.showPopover) {
            return;
        }
        this.fileUpload.nativeElement.click();
    }

    onForceClick(): void {
        this.fileChanged.emit({
            forceUpgrade: this.showPopover,
            uploadFileData: this._uploadFileData
        });
    }

    onCancel() {
        this.showPopover = false;
    }

    onOpenChange(isOpen: boolean) {
        if (!isOpen) {
            this.showPopover = false;
        }
    }
}
