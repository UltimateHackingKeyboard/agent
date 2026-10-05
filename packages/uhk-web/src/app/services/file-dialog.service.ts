import { Injectable } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { saveAs } from 'file-saver';

import { SHARED_CONFIG_DEFAULT_FILE_NAME, UploadFileData } from 'uhk-common';

export interface SaveFileResult {
    canceled: boolean;
    filePath?: string;
}

/**
 * Platform specific user configuration import/export file picker.
 *
 * The default implementation uses the browser file input and file-saver.
 * The Electron implementation (see ElectronFileDialogService) uses the native
 * dialogs and remembers the last used folder.
 */
@Injectable()
export class FileDialogService {
    openUserConfigurationFile(): Observable<UploadFileData | null> {
        return new Observable<UploadFileData | null>(subscriber => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json,.bin';
            input.style.display = 'none';
            document.body.appendChild(input);

            const cleanup = () => input.remove();
            input.onchange = () => {
                const files = input.files;
                if (!files || files.length === 0) {
                    cleanup();
                    subscriber.next(null);
                    subscriber.complete();
                    return;
                }

                const file = files[0];
                const fileReader = new FileReader();
                fileReader.onloadend = () => {
                    cleanup();
                    subscriber.next({
                        filename: file.name,
                        data: Array.from(new Uint8Array(fileReader.result as ArrayBuffer)),
                        saveInHistory: false,
                    });
                    subscriber.complete();
                };
                fileReader.onerror = () => {
                    cleanup();
                    subscriber.error(fileReader.error);
                };
                fileReader.readAsArrayBuffer(file);
            };
            input.click();
        });
    }

    saveUserConfigurationFile(fileName: string, data: Uint8Array, mimeType: string): Observable<SaveFileResult> {
        const arrayBuffer = new ArrayBuffer(data.byteLength);
        new Uint8Array(arrayBuffer).set(data);
        saveAs(new Blob([arrayBuffer], { type: mimeType }), fileName);

        return from(Promise.resolve({ canceled: false }));
    }

    /**
     * Lets the user choose a shared configuration file in a folder synced between computers.
     * Returns null when the platform has no access to a filesystem path (for example the browser).
     */
    selectSharedConfigurationFile(_currentPath?: string): Observable<string | null> {
        return of(null);
    }

    /**
     * The path Agent uses for the shared configuration file when the user has not chosen one.
     */
    getDefaultSharedConfigurationFilePath(): Observable<string> {
        return of(SHARED_CONFIG_DEFAULT_FILE_NAME);
    }
}
