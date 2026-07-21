import { app, BrowserWindow, ipcMain, Menu, nativeImage, Tray } from 'electron';

import { IpcEvents, LogService } from 'uhk-common';
import { getApplicationSettingsFromStorage } from '../util/get-application-settings';

const MINIMIZE_SUPPRESS_MS = 500;

export class TrayService {
    private tray: Tray | null = null;
    private contextMenu: Menu | null = null;
    private hiddenToTray = false;
    private isMaximized = false;
    private isQuitting = false;
    private suppressMinimizeToTray = false;
    private suppressMinimizeTimeout: NodeJS.Timeout | null = null;
    private trayActive = false;
    private wasFullScreenBeforeTray = false;
    private wasMaximizedBeforeTray = false;
    private win: BrowserWindow | null = null;

    private readonly minimizeToTrayChangedHandler = (_event: Electron.IpcMainEvent, args: [boolean]) => {
        this.setMinimizeToTrayEnabled(args[0] ?? false);
    };

    private readonly trayClickHandler = (): void => {
        this.toggleWindow();
    };

    constructor(private logService: LogService,
                private iconPath: string) {
    }

    init(win: BrowserWindow): void {
        this.win = win;
        this.isMaximized = win.isMaximized();

        win.on('maximize', () => {
            this.isMaximized = true;
        });

        win.on('unmaximize', () => {
            if (this.suppressMinimizeToTray) {
                return;
            }

            // On Windows, unmaximize can fire immediately before minimize when hiding a
            // maximized window. Defer clearing so minimize-to-tray keeps the state.
            setImmediate(() => {
                const currentWin = this.getWindow();
                if (!currentWin || currentWin.isMinimized()) {
                    return;
                }

                this.isMaximized = false;
            });
        });

        win.on('minimize', () => {
            void this.handleMinimize();
        });

        win.on('close', () => {
            if (this.isQuitting) {
                this.destroy();
            }
        });

        ipcMain.on(IpcEvents.app.minimizeToTrayChanged, this.minimizeToTrayChangedHandler);
    }

    setMinimizeToTrayEnabled(enabled: boolean): void {
        if (enabled) {
            this.ensureTray();
            this.logService.misc('[TrayService] Tray enabled');
            return;
        }

        if (this.hiddenToTray) {
            this.revealWindow();
        }

        this.destroyTrayIcon();
        this.logService.misc('[TrayService] Tray disabled');
    }

    async initTrayIfEnabled(): Promise<void> {
        const { minimizeToTray = false } = await getApplicationSettingsFromStorage();
        if (!minimizeToTray) {
            return;
        }

        this.ensureTray();
    }

    markQuitting(): void {
        this.isQuitting = true;
    }

    showWindow(): void {
        this.revealWindow();
    }

    startInTray(): void {
        this.ensureTray();
        this.hideToTray();
    }

    private getWindow(): BrowserWindow | null {
        const win = this.win;
        if (!win || win.isDestroyed()) {
            return null;
        }

        return win;
    }

    private notifyMinimizeToTrayDisabledOnLinux(): void {
        const win = this.getWindow();
        if (!win) {
            return;
        }

        win.webContents.send(IpcEvents.app.minimizeToTrayDisabledOnLinux);
    }

    private runWithMinimizeSuppressed(action: () => void): void {
        this.suppressMinimizeToTray = true;
        if (this.suppressMinimizeTimeout) {
            clearTimeout(this.suppressMinimizeTimeout);
        }

        action();

        this.suppressMinimizeTimeout = setTimeout(() => {
            this.suppressMinimizeToTray = false;
            this.suppressMinimizeTimeout = null;
        }, MINIMIZE_SUPPRESS_MS);
    }

    private captureWindowStateBeforeTray(win: BrowserWindow): void {
        this.wasFullScreenBeforeTray = win.isFullScreen();
        this.wasMaximizedBeforeTray = this.isMaximized || win.isMaximized();
    }

    private hideToTray(): void {
        const win = this.getWindow();
        if (!win) {
            return;
        }

        this.captureWindowStateBeforeTray(win);
        this.hiddenToTray = true;
        this.runWithMinimizeSuppressed(() => {
            if (process.platform === 'linux') {
                win.setSkipTaskbar(true);
            }

            if (win.isMinimized()) {
                win.restore();
            }

            win.hide();
        });
        this.logService.misc('[TrayService] Window hidden to tray', {
            wasMaximized: this.wasMaximizedBeforeTray,
            wasFullScreen: this.wasFullScreenBeforeTray,
        });
    }

    private revealWindow(): void {
        const win = this.getWindow();
        if (!win) {
            return;
        }

        const restoreMaximized = this.wasMaximizedBeforeTray;
        const restoreFullScreen = this.wasFullScreenBeforeTray;

        // Defer until after tray click / context menu handling so focus is not stolen.
        setImmediate(() => {
            const currentWin = this.getWindow();
            if (!currentWin) {
                return;
            }

            this.hiddenToTray = false;
            this.runWithMinimizeSuppressed(() => {
                if (process.platform === 'linux') {
                    currentWin.setSkipTaskbar(false);
                }

                currentWin.show();

                if (currentWin.isMinimized()) {
                    currentWin.restore();
                }

                if (restoreFullScreen) {
                    currentWin.setFullScreen(true);
                } else if (restoreMaximized) {
                    currentWin.maximize();
                }

                this.isMaximized = restoreMaximized;
                currentWin.focus();
            });
            this.logService.misc('[TrayService] Window restored from tray', {
                restoreMaximized,
                restoreFullScreen,
            });
        });
    }

    private toggleWindow(): void {
        if (!this.trayActive) {
            return;
        }

        if (this.hiddenToTray) {
            this.revealWindow();
            return;
        }

        const win = this.getWindow();
        if (!win) {
            return;
        }

        setImmediate(() => {
            if (this.hiddenToTray || !win.isVisible() || win.isMinimized()) {
                this.revealWindow();
                return;
            }

            this.hideToTray();
        });
    }

    private async handleMinimize(): Promise<void> {
        if (this.suppressMinimizeToTray || this.hiddenToTray) {
            return;
        }

        const win = this.getWindow();
        if (!win) {
            return;
        }

        const { minimizeToTray = false } = await getApplicationSettingsFromStorage();
        if (!minimizeToTray || this.suppressMinimizeToTray || this.hiddenToTray) {
            return;
        }

        this.ensureTray();
        this.hideToTray();
    }

    private buildTrayIcon(): Electron.NativeImage {
        const icon = nativeImage.createFromPath(this.iconPath);
        const trayIcon = process.platform === 'darwin'
            ? icon.resize({ width: 16, height: 16 })
            : icon.resize({ width: 22, height: 22 });

        if (process.platform === 'darwin') {
            trayIcon.setTemplateImage(true);
        }

        return trayIcon;
    }

    private buildContextMenu(): Menu {
        return Menu.buildFromTemplate([
            {
                label: 'Show UHK Agent',
                click: () => this.revealWindow(),
            },
            { type: 'separator' },
            {
                label: 'Quit',
                click: () => {
                    this.isQuitting = true;
                    app.quit();
                },
            },
        ]);
    }

    private createTrayInstance(): void {
        this.tray = new Tray(this.buildTrayIcon());
        this.logService.misc('[TrayService] Tray instance created');
    }

    private activateTray(): void {
        if (!this.tray || this.tray.isDestroyed()) {
            return;
        }

        this.tray.setImage(this.buildTrayIcon());
        this.tray.setToolTip('UHK Agent');
        this.contextMenu = this.buildContextMenu();

        // setContextMenu shows the menu on right-click on Linux/Windows and on left-click on macOS.
        // popUpContextMenu is not supported on Linux, so setContextMenu must be used there.
        this.tray.setContextMenu(this.contextMenu);

        if (process.platform !== 'darwin') {
            this.tray.removeAllListeners('click');
            this.tray.on('click', this.trayClickHandler);
        }

        this.trayActive = true;
        this.logService.misc('[TrayService] Tray icon activated');
    }

    private ensureTray(): void {
        if (this.tray && !this.tray.isDestroyed()) {
            if (!this.trayActive) {
                this.activateTray();
            }

            return;
        }

        this.createTrayInstance();
        this.activateTray();
    }

    private destroy(): void {
        ipcMain.removeListener(IpcEvents.app.minimizeToTrayChanged, this.minimizeToTrayChangedHandler);
        this.destroyTrayInstance();
    }

    private destroyTrayIcon(): void {
        const hadActiveTray = this.trayActive;

        this.destroyTrayInstance();

        // Linux uses Chromium's StatusNotifierItem integration, which does not reliably
        // unregister tray icons when Tray.destroy() is called. The panel entry can remain
        // visible (sometimes as a stale or broken icon) until Agent exits. Do not try to
        // hide the icon with createEmpty() or a blank image — that produces a worse placeholder.
        // See https://github.com/electron/electron/issues/49517
        if (process.platform === 'linux' && hadActiveTray) {
            this.notifyMinimizeToTrayDisabledOnLinux();
        }
    }

    private destroyTrayInstance(): void {
        if (!this.tray || this.tray.isDestroyed()) {
            this.tray = null;
            this.contextMenu = null;
            this.trayActive = false;
            return;
        }

        this.tray.removeAllListeners();
        this.tray.setContextMenu(null);
        this.tray.destroy();
        this.tray = null;
        this.contextMenu = null;
        this.trayActive = false;
        this.logService.misc('[TrayService] Tray icon destroyed');
    }
}
