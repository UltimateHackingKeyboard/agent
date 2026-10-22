import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { UploadFileData } from 'uhk-common';

@Component({
    selector: 'file-upload',
    standalone: false,
    templateUrl: './file-upload.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileUploadComponent {
    @Input() label = 'Select file';
    @Input() disabled: boolean;
    @Input() accept: string;

    @Output() fileChanged = new EventEmitter<UploadFileData>();

    changeFile(event: Event): void {
        const files = (event.target as HTMLInputElement).files;

        if (files.length === 0) {
            return;
        }

        const fileReader = new FileReader();
        fileReader.onloadend = function () {
            const arrayBuffer = new Uint8Array(fileReader.result as ArrayBuffer);
            const target = (event.target || event.srcElement || event.currentTarget) as HTMLInputElement;
            this.fileChanged.emit({
                filename: target.value,
                data: Array.from(arrayBuffer)
            });

            target.value = null;
        }.bind(this);
        fileReader.readAsArrayBuffer(files[0] as Blob);
    }
}
