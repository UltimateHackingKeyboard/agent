import { app, dialog, ipcMain } from 'electron';
import settings from 'electron-settings';
import { promises as fs } from 'fs';
import { dirname, join } from 'path';
import process from 'node:process';

import {
    IpcEvents,
    LogService,
    OpenUserConfigDialogResult,
    SaveUserConfigDialogData,
    SaveUserConfigDialogResult,
    SelectSharedConfigDialogResult,
    SHARED_CONFIG_DEFAULT_FILE_NAME,
} from 'uhk-common';

import { MainServiceBase } from './main-service-base';

const USER_CONFIG_FOLDER_SETTING = 'user-config-folder';

/**
 * On Linux Electron routes the file dialogs through xdg-desktop-portal. When the
 * portal's FileChooser backend is missing or broken - for example
 * xdg-desktop-portal-gnome without Nautilus, or a compositor that cannot export
 * the parent window handle - the portal aborts the request with response code 2
 * and Chromium logs "Request ended (non-user cancelled)". Electron maps that
 * error onto a regular cancellation, so the dialog silently does nothing.
 *
 * A real cancellation can only happen after the dialog has been shown and the
 * user has interacted with it, which always takes noticeably longer than the
 * immediate portal abort, so a dialog that is "cancelled" this fast never
 * appeared. In that case the caller falls back to a save method that does not
 * depend on the portal.
 */
const DIALOG_NEVER_APPEARED_THRESHOLD_MS = 500;

export class FileDialogService extends MainServiceBase {
    constructor(protected logService: LogService,
                protected win: Electron.BrowserWindow) {
        super(logService, win);

        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        ipcMain.handle(IpcEvents.fileDialog.openUserConfig, this.openUserConfig.bind(this));
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        ipcMain.handle(IpcEvents.fileDialog.saveUserConfig, this.saveUserConfig.bind(this));
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        ipcMain.handle(IpcEvents.fileDialog.selectSharedConfig, this.selectSharedConfig.bind(this));
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        ipcMain.handle(IpcEvents.fileDialog.getDefaultSharedConfig, this.getDefaultSharedConfig.bind(this));

        logService.misc('[FileDialogService] init success');
    }

    private async openUserConfig(): Promise<OpenUserConfigDialogResult> {
        const defaultPath = await this.getDefaultUserConfigFolder();
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
        const defaultPath = join(await this.getDefaultUserConfigFolder(), data.fileName);
        this.logService.misc(`[FileDialogService] save user configuration dialog, defaultPath: ${defaultPath}`);

        const startedAt = Date.now();
        const result = await dialog.showSaveDialog(this.win, {
            defaultPath,
            filters: [
                { name: 'User configuration', extensions: [data.fileName.split('.').pop()] },
                { name: 'All files', extensions: ['*'] },
            ],
        });

        if (result.canceled || !result.filePath) {
            const elapsed = Date.now() - startedAt;

            if (process.platform === 'linux' && elapsed < DIALOG_NEVER_APPEARED_THRESHOLD_MS) {
                this.logService.misc(
                    `[FileDialogService] the save dialog closed after ${elapsed} ms without appearing; ` +
                    'the xdg-desktop-portal file chooser is unavailable');
                return { canceled: true, portalFailed: true };
            }

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

    private async selectSharedConfig(_event: Electron.IpcMainInvokeEvent,
                                     data?: { currentPath?: string }): Promise<SelectSharedConfigDialogResult> {
        const defaultPath = data?.currentPath || this.getDefaultSharedConfigPath();
        this.logService.misc(`[FileDialogService] select shared configuration dialog, defaultPath: ${defaultPath}`);

        const result = await dialog.showSaveDialog(this.win, {
            title: 'Select shared configuration file',
            defaultPath,
            filters: [
                { name: 'User configuration', extensions: ['json'] },
                { name: 'All files', extensions: ['*'] },
            ],
        });

        if (result.canceled || !result.filePath) {
            return { canceled: true };
        }

        this.logService.misc(`[FileDialogService] selected shared configuration: ${result.filePath}`);

        return {
            canceled: false,
            filePath: result.filePath,
        };
    }

    private getDefaultSharedConfig(): string {
        return this.getDefaultSharedConfigPath();
    }

    private getDefaultSharedConfigPath(): string {
        return join(app.getPath('userData'), SHARED_CONFIG_DEFAULT_FILE_NAME);
    }

    private async getUserConfigFolder(): Promise<string | undefined> {
        const folder = await settings.get(USER_CONFIG_FOLDER_SETTING);

        return typeof folder === 'string' && folder.length > 0 ? folder : undefined;
    }

    /**
     * Always returns an absolute folder. The native file chooser must never
     * receive a relative default path: on Linux the xdg-desktop-portal file
     * chooser opens at the unusable relative directory "." for those.
     */
    private async getDefaultUserConfigFolder(): Promise<string> {
        const rememberedFolder = await this.getUserConfigFolder();

        if (rememberedFolder && await this.directoryExists(rememberedFolder)) {
            return rememberedFolder;
        }

        return this.getFallbackUserConfigFolder();
    }

    private getFallbackUserConfigFolder(): string {
        try {
            return app.getPath('downloads');
        } catch {
            return app.getPath('home');
        }
    }

    private async directoryExists(dir: string): Promise<boolean> {
        try {
            return (await fs.stat(dir)).isDirectory();
        } catch {
            return false;
        }
    }

    private async saveUserConfigFolder(filePath: string): Promise<void> {
        await settings.set(USER_CONFIG_FOLDER_SETTING, dirname(filePath));
    }
}
