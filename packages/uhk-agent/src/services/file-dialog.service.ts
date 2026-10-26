import { app, dialog, ipcMain } from 'electron';
import settings from 'electron-settings';
import { promises as fs, Dirent } from 'fs';
import { dirname, extname, isAbsolute, join, parse, relative, resolve } from 'path';
import process from 'node:process';

import {
    IpcEvents,
    ListUserConfigFilesResult,
    LogService,
    OpenUserConfigDialogResult,
    SaveUserConfigDialogData,
    SaveUserConfigDialogResult,
    SelectSharedConfigDialogResult,
    SHARED_CONFIG_DEFAULT_FILE_NAME,
    UserConfigFileInfo,
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
 * appeared. In that case the service bypasses the dialog: the open dialog
 * reports portalFailed so the renderer shows its own in-app picker, and the save
 * dialog writes the file to the fallback folder itself.
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
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        ipcMain.handle(IpcEvents.fileDialog.listUserConfigFiles, this.listUserConfigFiles.bind(this));
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        ipcMain.handle(IpcEvents.fileDialog.readUserConfigFile, this.readUserConfigFile.bind(this));

        logService.misc('[FileDialogService] init success');
    }

    private async openUserConfig(): Promise<OpenUserConfigDialogResult> {
        const defaultPath = await this.getDefaultUserConfigFolder();
        this.logService.misc(`[FileDialogService] open user configuration dialog, defaultPath: ${defaultPath}`);

        const startedAt = Date.now();
        const result = await dialog.showOpenDialog(this.win, {
            defaultPath,
            properties: ['openFile'],
            filters: [
                { name: 'User configuration', extensions: ['json', 'bin'] },
                { name: 'All files', extensions: ['*'] },
            ],
        });

        if (result.canceled || result.filePaths.length === 0) {
            if (this.dialogNeverAppeared(startedAt)) {
                this.logService.misc(
                    `[FileDialogService] the open dialog closed after ${Date.now() - startedAt} ms without appearing; ` +
                    'the xdg-desktop-portal file chooser is unavailable');
                return { canceled: true, portalFailed: true };
            }

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
            if (this.dialogNeverAppeared(startedAt)) {
                this.logService.misc(
                    `[FileDialogService] the save dialog closed after ${Date.now() - startedAt} ms without appearing; ` +
                    'the xdg-desktop-portal file chooser is unavailable');
                const filePath = await this.saveUserConfigWithoutDialog(data.fileName, data.content);

                return { canceled: false, filePath, savedWithoutDialog: true };
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

    /**
     * Lists the user configuration files of the import folder. The in-app picker
     * uses it instead of the native open dialog when the Linux xdg-desktop-portal
     * file chooser is unavailable.
     */
    private async listUserConfigFiles(): Promise<ListUserConfigFilesResult> {
        const folder = await this.getDefaultUserConfigFolder();
        this.logService.misc(`[FileDialogService] list user configuration files, folder: ${folder}`);

        return {
            folder,
            files: await this.listUserConfigFilesIn(folder),
        };
    }

    private async listUserConfigFilesIn(folder: string): Promise<UserConfigFileInfo[]> {
        let entries: Dirent[];

        try {
            entries = await fs.readdir(folder, { withFileTypes: true });
        } catch (error) {
            this.logService.misc(`[FileDialogService] cannot list user configuration files, folder: ${folder}`, error);

            return [];
        }

        return entries
            .filter(entry => entry.isFile() && ['.json', '.bin'].includes(extname(entry.name).toLowerCase()))
            .map(entry => ({ name: entry.name, path: join(folder, entry.name) }))
            .sort((a, b) => a.name.localeCompare(b.name));
    }

    /**
     * Reads a user configuration file that the in-app picker selected. Only files
     * of the import folder are read, so a compromised renderer cannot use this
     * channel to read arbitrary files.
     */
    private async readUserConfigFile(_event: Electron.IpcMainInvokeEvent,
                                     filePath: string): Promise<OpenUserConfigDialogResult> {
        const folder = await this.getDefaultUserConfigFolder();

        if (!this.isInsideFolder(filePath, folder)) {
            this.logService.error(`[FileDialogService] refusing to read a user configuration outside of ${folder}: ${filePath}`);

            return { canceled: true };
        }

        const buffer = await fs.readFile(filePath);
        await this.saveUserConfigFolder(filePath);
        this.logService.misc(`[FileDialogService] opened user configuration with the in-app picker: ${filePath}`);

        return {
            canceled: false,
            filePath,
            data: Array.from(buffer),
        };
    }

    private isInsideFolder(filePath: string, folder: string): boolean {
        const relativePath = relative(resolve(folder), resolve(filePath));

        return relativePath.length > 0 && !relativePath.startsWith('..') && !isAbsolute(relativePath);
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

    /**
     * A real cancellation can only happen after the dialog has been shown and the
     * user has interacted with it, which always takes noticeably longer than the
     * immediate portal abort, so a dialog that is "cancelled" this fast never
     * appeared.
     */
    private dialogNeverAppeared(startedAt: number): boolean {
        return process.platform === 'linux' && Date.now() - startedAt < DIALOG_NEVER_APPEARED_THRESHOLD_MS;
    }

    /**
     * Writes the configuration without the native save dialog, because the Linux
     * xdg-desktop-portal file chooser could not be shown. The file goes into the
     * remembered configuration folder when it still exists, otherwise into the
     * downloads folder. Never overwrites an existing file.
     */
    private async saveUserConfigWithoutDialog(fileName: string, base64Content: string): Promise<string> {
        const folder = await this.getDefaultUserConfigFolder();
        await fs.mkdir(folder, { recursive: true });

        const filePath = await this.uniqueFilePath(join(folder, fileName));
        await fs.writeFile(filePath, Buffer.from(base64Content, 'base64'));
        this.logService.misc(`[FileDialogService] saved user configuration without a save dialog: ${filePath}`);

        return filePath;
    }

    private async uniqueFilePath(filePath: string): Promise<string> {
        const { dir, name, ext } = parse(filePath);
        let candidate = filePath;

        for (let counter = 1; await this.fileExists(candidate); counter++) {
            candidate = join(dir, `${name} (${counter})${ext}`);
        }

        return candidate;
    }

    private async fileExists(filePath: string): Promise<boolean> {
        try {
            await fs.access(filePath);

            return true;
        } catch {
            return false;
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
