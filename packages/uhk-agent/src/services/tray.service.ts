import { app, BrowserWindow, Menu, nativeImage, Tray } from 'electron';

import { LogService } from 'uhk-common';
import { getApplicationSettingsFromStorage } from '../util/get-application-settings';

const MINIMIZE_SUPPRESS_MS = 500;

export class TrayService {
    private tray: Tray | null = null;
    private contextMenu: Menu | null = null;
    private hiddenToTray = false;
    private isQuitting = false;
    private suppressMinimizeToTray = false;
    private suppressMinimizeTimeout: NodeJS.Timeout | null = null;
    private win: BrowserWindow | null = null;

    constructor(private logService: LogService,
                private iconPath: string) {
    }

    init(win: BrowserWindow): void {
        this.win = win;

        win.on('minimize', () => {
            void this.handleMinimize();
        });

        win.on('close', () => {
            if (this.isQuitting) {
                this.destroy();
            }
        });
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

    private hideToTray(): void {
        const win = this.getWindow();
        if (!win) {
            return;
        }

        this.hiddenToTray = true;
        this.runWithMinimizeSuppressed(() => {
            if (process.platform === 'linux') {
                win.setSkipTaskbar(true);
            }

            win.hide();
        });
        this.logService.misc('[TrayService] Window hidden to tray');
    }

    private revealWindow(): void {
        const win = this.getWindow();
        if (!win) {
            return;
        }

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

                currentWin.focus();
            });
            this.logService.misc('[TrayService] Window restored from tray');
        });
    }

    private toggleWindow(): void {
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

    private ensureTray(): void {
        if (this.tray) {
            return;
        }

        const icon = nativeImage.createFromPath(this.iconPath);
        const trayIcon = process.platform === 'darwin'
            ? icon.resize({ width: 16, height: 16 })
            : icon.resize({ width: 22, height: 22 });

        if (process.platform === 'darwin') {
            trayIcon.setTemplateImage(true);
        }

        this.tray = new Tray(trayIcon);
        this.tray.setToolTip('UHK Agent');

        this.contextMenu = Menu.buildFromTemplate([
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

        // setContextMenu shows the menu on right-click on Linux/Windows and on left-click on macOS.
        // popUpContextMenu is not supported on Linux, so setContextMenu must be used there.
        this.tray.setContextMenu(this.contextMenu);

        if (process.platform !== 'darwin') {
            this.tray.on('click', () => {
                this.toggleWindow();
            });
        }

        this.logService.misc('[TrayService] Tray icon created');
    }

    private destroy(): void {
        if (!this.tray) {
            return;
        }

        this.tray.destroy();
        this.tray = null;
        this.contextMenu = null;
        this.logService.misc('[TrayService] Tray icon destroyed');
    }
}
