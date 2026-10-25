/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, inject } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, from, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import {
    IpcEvents,
    ListUserConfigFilesResult,
    OpenUserConfigDialogResult,
    SaveUserConfigDialogResult,
    SelectSharedConfigDialogResult,
    UploadFileData,
} from 'uhk-common';

import { FileDialogService, SaveFileResult } from '../../app/services/file-dialog.service';
import { UserConfigFilePickerComponent } from
    '../components/user-config-file-picker/user-config-file-picker.component';

@Injectable()
export class ElectronFileDialogService extends FileDialogService {
    private readonly modalService = inject(NgbModal);

    openUserConfigurationFile(): Observable<UploadFileData | null> {
        return from(
            this.ipcInvoke<OpenUserConfigDialogResult>(IpcEvents.fileDialog.openUserConfig)
        ).pipe(
            mergeMap(result => {
                if (result?.portalFailed) {
                    return this.pickUserConfigurationWithInAppDialog();
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
            this.ipcInvoke<SaveUserConfigDialogResult>(IpcEvents.fileDialog.saveUserConfig, {
                fileName,
                content: toBase64(data),
            })
        );
    }

    selectSharedConfigurationFile(currentPath?: string): Observable<string | null> {
        return from(
            this.ipcInvoke<SelectSharedConfigDialogResult>(
                IpcEvents.fileDialog.selectSharedConfig,
                { currentPath }
            )
        ).pipe(
            map(result => result && !result.canceled && result.filePath ? result.filePath : null)
        );
    }

    getDefaultSharedConfigurationFilePath(): Observable<string> {
        return from(
            this.ipcInvoke<string>(IpcEvents.fileDialog.getDefaultSharedConfig)
        );
    }

    /**
     * The native open dialog never appeared, so the renderer's own
     * <input type="file"> picker cannot help either: Chromium's file chooser goes
     * through the same broken xdg-desktop-portal. Instead Agent lists the
     * configuration files of the import folder and draws its own picker.
     */
    private pickUserConfigurationWithInAppDialog(): Observable<UploadFileData | null> {
        return from(this.pickUserConfigurationFile()).pipe(
            mergeMap(result => result && !result.canceled && result.data
                ? of({
                    filename: result.filePath,
                    data: result.data,
                    saveInHistory: false,
                })
                : of(null))
        );
    }

    private async pickUserConfigurationFile(): Promise<OpenUserConfigDialogResult | null> {
        const list = await this.ipcInvoke<ListUserConfigFilesResult>(IpcEvents.fileDialog.listUserConfigFiles);
        const modalRef = this.modalService.open(UserConfigFilePickerComponent, {
            backdrop: 'static',
            size: 'lg',
        });
        modalRef.componentInstance.folder = list?.folder ?? '';
        modalRef.componentInstance.files = list?.files ?? [];

        let filePath: string | undefined;

        try {
            filePath = await modalRef.result;
        } catch {
            // The user dismissed the picker.
            return null;
        }

        if (!filePath) {
            return null;
        }

        return this.ipcInvoke<OpenUserConfigDialogResult>(IpcEvents.fileDialog.readUserConfigFile, filePath);
    }

    private ipcInvoke<T>(channel: string, ...args: any[]): Promise<T> {
        return (window as any).electron.ipcRenderer.invoke(channel, ...args) as Promise<T>;
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
