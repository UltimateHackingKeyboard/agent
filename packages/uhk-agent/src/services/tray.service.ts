import { app, BrowserWindow, ipcMain, Menu, nativeImage, nativeTheme, Tray } from 'electron';
import path from 'node:path';
import { IpcEvents, LogService } from 'uhk-common';

import { MainServiceBase } from './main-service-base';

const MINIMIZE_SUPPRESS_MS = 500;

export class TrayService extends MainServiceBase {
    private tray: Tray | null = null;
    private contextMenu: Menu | null = null;
    private hiddenToTray = false;
    private isMaximized = false;
    private suppressMinimizeToTray = false;
    private suppressMinimizeTimeout: NodeJS.Timeout | null = null;
    private trayActive = false;
    private wasFullScreenBeforeTray = false;
    private wasMaximizedBeforeTray = false;
    private isSubscribedToIpcEvents = false;

    private readonly minimizeToTrayChangedHandler = (_event: Electron.IpcMainEvent, args: [boolean]) => {
        this.setMinimizeToTrayEnabled(args[0] ?? false);
    };

    private readonly themeChangedHandler = (): void => {
        if (this.tray && !this.tray.isDestroyed()) {
            this.tray.setImage(this.buildTrayIcon());
        }
    };

    constructor(protected logService: LogService,
                protected win: Electron.BrowserWindow,
                ) {
        super(logService, win);
        this.init(win);
    }

    init(win: BrowserWindow): void {
        this.detachWindowListeners();

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

        this.subscribeToIpcEvents();
    }

    destroy(): void {
        this.clearSuppressMinimizeTimer()
        ipcMain.removeListener(IpcEvents.app.minimizeToTrayChanged, this.minimizeToTrayChangedHandler);
        this.destroyTrayInstance();
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
        const { minimizeToTray = false } = await this.getApplicationSettings();
        if (!minimizeToTray) {
            return;
        }

        this.ensureTray();
    }

    revealWindow(): void {
        const restoreMaximized = this.wasMaximizedBeforeTray;
        const restoreFullScreen = this.wasFullScreenBeforeTray;

        // Defer until after tray click / context menu handling so focus is not stolen.
        this.runWindowActionImmediate((currentWin) => {
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

    startInTray(): void {
        this.ensureTray();
        this.hideToTray();
    }

    private clearSuppressMinimizeTimer() {
        if (this.suppressMinimizeTimeout) {
            clearTimeout(this.suppressMinimizeTimeout);
        }
    }

    private detachWindowListeners() {
        if (!this.win) {
            return;
        }

        /* eslint-disable @typescript-eslint/no-unsafe-argument */
        this.win.removeListener('minimize', this.toggleWindow.bind(this));
        this.win.removeListener('maximize', this.toggleWindow.bind(this));
        this.win.removeListener('unmaximize', this.toggleWindow.bind(this));
        this.win.removeListener('close', this.toggleWindow.bind(this));
        /* eslint-enable @typescript-eslint/no-unsafe-argument */
    }

    private getWindow(): BrowserWindow | null {
        const win = this.win;
        if (!win || win.isDestroyed()) {
            return null;
        }

        return win;
    }

    private runWithMinimizeSuppressed(action: () => void): void {
        this.suppressMinimizeToTray = true;
        this.clearSuppressMinimizeTimer();

        action();

        this.suppressMinimizeTimeout = setTimeout(() => {
            this.suppressMinimizeToTray = false;
            this.suppressMinimizeTimeout = null;
        }, MINIMIZE_SUPPRESS_MS);
    }

    private subscribeToIpcEvents(): void {
        if (this.isSubscribedToIpcEvents) {
            return;
        }

        this.isSubscribedToIpcEvents = true;
        ipcMain.on(IpcEvents.app.minimizeToTrayChanged, this.minimizeToTrayChangedHandler);
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

    private toggleWindow(): void {
        if (!this.trayActive) {
            return;
        }

        if (this.hiddenToTray) {
            this.revealWindow();
            return;
        }

        this.runWindowActionImmediate((win) => {
            if (this.hiddenToTray || !win.isVisible() || win.isMinimized()) {
                this.revealWindow();
                return;
            }

            this.hideToTray();
        })
    }

    private async handleMinimize(): Promise<void> {
        if (this.suppressMinimizeToTray || this.hiddenToTray) {
            return;
        }

        const win = this.getWindow();
        if (!win) {
            return;
        }

        const { minimizeToTray = false } = await this.getApplicationSettings();
        if (!minimizeToTray || this.suppressMinimizeToTray || this.hiddenToTray) {
            return;
        }

        this.ensureTray();
        this.hideToTray();
    }

    private buildTrayIcon(): Electron.NativeImage {
        const trayAssetsDir = path.join(import.meta.dirname, 'images', 'tray-icons')

        if (process.platform === 'linux') {
            return nativeImage.createFromPath(
                path.join(trayAssetsDir, 'trayIcon-linux.png'));   // 22px, @2x auto
        }

        // macOS & Windows: 16px with @2x sibling picked up automatically.
        // No setTemplateImage — this is a full-color icon by design.
        return nativeImage.createFromPath(
            path.join(trayAssetsDir, 'trayIcon.png'));
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
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            this.tray.on('click', this.toggleWindow.bind(this));
            nativeTheme.on('updated', this.themeChangedHandler);
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

    private destroyTrayIcon(): void {
        const hadActiveTray = this.trayActive;

        this.destroyTrayInstance();

        // Linux uses Chromium's StatusNotifierItem integration, which does not reliably
        // unregister tray icons when Tray.destroy() is called. The panel entry can remain
        // visible (sometimes as a stale or broken icon) until Agent exits. Do not try to
        // hide the icon with createEmpty() or a blank image — that produces a worse placeholder.
        // See https://github.com/electron/electron/issues/49517
        if (process.platform === 'linux' && hadActiveTray) {
            this.sendIpcToWindow(IpcEvents.app.minimizeToTrayDisabledOnLinux)
        }
    }

    private destroyTrayInstance(): void {
        nativeTheme.removeListener('updated', this.themeChangedHandler);

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

    private runWindowAction(action: (win: BrowserWindow) => void): void {
        const win = this.getWindow();
        if (!win) {
            return;
        }

        action(win);
    }

    private runWindowActionImmediate(action: (win: BrowserWindow) => void): void {
        setImmediate(() => {
            this.runWindowAction(action);
        })
    }
}
