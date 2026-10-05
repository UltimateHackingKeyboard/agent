/* eslint-disable @typescript-eslint/no-explicit-any */
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

import {
    IpcEvents,
    OpenUserConfigDialogResult,
    SaveUserConfigDialogResult,
    UploadFileData,
} from 'uhk-common';

import { FileDialogService, SaveFileResult } from '../../app/services/file-dialog.service';

export class ElectronFileDialogService extends FileDialogService {
    openUserConfigurationFile(): Observable<UploadFileData | null> {
        return from(
            (window as any).electron.ipcRenderer.invoke(IpcEvents.fileDialog.openUserConfig) as Promise<OpenUserConfigDialogResult>
        ).pipe(
            map(result => {
                if (!result || result.canceled || !result.data) {
                    return null;
                }

                return {
                    filename: result.filePath,
                    data: result.data,
                    saveInHistory: false,
                };
            })
        );
    }

    saveUserConfigurationFile(fileName: string, data: Uint8Array, _mimeType: string): Observable<SaveFileResult> {
        return from(
            (window as any).electron.ipcRenderer.invoke(IpcEvents.fileDialog.saveUserConfig, {
                fileName,
                content: toBase64(data),
            }) as Promise<SaveUserConfigDialogResult>
        );
    }
}

function toBase64(data: Uint8Array): string {
    let binary = '';
    const chunkSize = 0x8000;

    for (let i = 0; i < data.length; i += chunkSize) {
        binary += String.fromCharCode(...data.subarray(i, i + chunkSize));
    }

    return btoa(binary);
}
