import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { UploadFileData } from '../../models/upload-file-data';

@Component({
    selector: 'file-upload',
    templateUrl: './file-upload.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileUploadComponent {
    @Input() label = 'Select file';
    @Input() disabled: boolean;
    @Input() accept: string;

    @Output() fileChanged = new EventEmitter<UploadFileData>();

    changeFile(event): void {
        const files = event.srcElement.files;

        if (files.length === 0) {
            return;
        }

        const fileReader = new FileReader();
        fileReader.onloadend = function () {
            const arrayBuffer = new Uint8Array(fileReader.result);
            const target = event.target || event.srcElement || event.currentTarget;
            target.value = null;
            this.fileChanged.emit({
                filename: event.srcElement.value,
                data: Array.from(arrayBuffer)
            });
        }.bind(this);
        fileReader.readAsArrayBuffer(files[0]);
    }
}
