import { dialog, ipcMain } from 'electron';
import settings from 'electron-settings';
import { promises as fs } from 'fs';
import { dirname, join } from 'path';

import {
    IpcEvents,
    LogService,
    OpenUserConfigDialogResult,
    SaveUserConfigDialogData,
    SaveUserConfigDialogResult,
} from 'uhk-common';

import { MainServiceBase } from './main-service-base';

const USER_CONFIG_FOLDER_SETTING = 'user-config-folder';

export class FileDialogService extends MainServiceBase {
    constructor(protected logService: LogService,
                protected win: Electron.BrowserWindow) {
        super(logService, win);

        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        ipcMain.handle(IpcEvents.fileDialog.openUserConfig, this.openUserConfig.bind(this));
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        ipcMain.handle(IpcEvents.fileDialog.saveUserConfig, this.saveUserConfig.bind(this));

        logService.misc('[FileDialogService] init success');
    }

    private async openUserConfig(): Promise<OpenUserConfigDialogResult> {
        const defaultPath = await this.getUserConfigFolder();
        this.logService.misc(`[FileDialogService] open user configuration dialog, defaultPath: ${defaultPath}`);

        const result = await dialog.showOpenDialog(this.win, {
            defaultPath,
            properties: ['openFile'],
            filters: [
                { name: 'User configuration', extensions: ['json', 'bin'] },
                { name: 'All files', extensions: ['*'] },
            ],
        });

        if (result.canceled || result.filePaths.length === 0) {
            return { canceled: true };
        }

        const filePath = result.filePaths[0];
        await this.saveUserConfigFolder(filePath);

        const buffer = await fs.readFile(filePath);
        this.logService.misc(`[FileDialogService] opened user configuration: ${filePath}`);

        return {
            canceled: false,
            filePath,
            data: Array.from(buffer),
        };
    }

    private async saveUserConfig(_event: Electron.IpcMainInvokeEvent,
                                 data: SaveUserConfigDialogData): Promise<SaveUserConfigDialogResult> {
        const folder = await this.getUserConfigFolder();
        const defaultPath = folder ? join(folder, data.fileName) : data.fileName;
        this.logService.misc(`[FileDialogService] save user configuration dialog, defaultPath: ${defaultPath}`);

        const result = await dialog.showSaveDialog(this.win, {
            defaultPath,
            filters: [
                { name: 'User configuration', extensions: [data.fileName.split('.').pop()] },
                { name: 'All files', extensions: ['*'] },
            ],
        });

        if (result.canceled || !result.filePath) {
            return { canceled: true };
        }

        await fs.writeFile(result.filePath, Buffer.from(data.content, 'base64'));
        await this.saveUserConfigFolder(result.filePath);
        this.logService.misc(`[FileDialogService] saved user configuration: ${result.filePath}`);

        return {
            canceled: false,
            filePath: result.filePath,
        };
    }

    private async getUserConfigFolder(): Promise<string | undefined> {
        const folder = await settings.get(USER_CONFIG_FOLDER_SETTING);

        return typeof folder === 'string' && folder.length > 0 ? folder : undefined;
    }

    private async saveUserConfigFolder(filePath: string): Promise<void> {
        await settings.set(USER_CONFIG_FOLDER_SETTING, dirname(filePath));
    }
}
