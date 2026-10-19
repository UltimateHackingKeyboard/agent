/* eslint-disable @typescript-eslint/no-explicit-any */
import { Observable, from, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import {
    IpcEvents,
    OpenUserConfigDialogResult,
    SaveUserConfigDialogResult,
    SelectSharedConfigDialogResult,
    UploadFileData,
} from 'uhk-common';

import { FileDialogService, SaveFileResult } from '../../app/services/file-dialog.service';

export class ElectronFileDialogService extends FileDialogService {
    openUserConfigurationFile(): Observable<UploadFileData | null> {
        return from(
            (window as any).electron.ipcRenderer.invoke(IpcEvents.fileDialog.openUserConfig) as Promise<OpenUserConfigDialogResult>
        ).pipe(
            mergeMap(result => {
                if (result?.portalFailed) {
                    // The Linux xdg-desktop-portal file chooser could not be shown.
                    // Pick the file through the renderer instead, which does not use it.
                    return super.openUserConfigurationFile();
                }

                if (!result || result.canceled || !result.data) {
                    return of(null);
                }

                return of({
                    filename: result.filePath,
                    data: result.data,
                    saveInHistory: false,
                });
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

    selectSharedConfigurationFile(currentPath?: string): Observable<string | null> {
        return from(
            (window as any).electron.ipcRenderer.invoke(
                IpcEvents.fileDialog.selectSharedConfig,
                { currentPath }
            ) as Promise<SelectSharedConfigDialogResult>
        ).pipe(
            map(result => result && !result.canceled && result.filePath ? result.filePath : null)
        );
    }

    getDefaultSharedConfigurationFilePath(): Observable<string> {
        return from(
            (window as any).electron.ipcRenderer.invoke(IpcEvents.fileDialog.getDefaultSharedConfig) as Promise<string>
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
