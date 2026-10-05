import { ipcMain } from 'electron';
import settings from 'electron-settings';
import { FSWatcher, promises as fs, watch } from 'fs';
import { createHash } from 'crypto';
import { basename, dirname } from 'path';

import {
    IpcEvents,
    LogService,
    SharedConfigAcknowledgeData,
    SharedConfigApplyData,
    SharedConfigConfiguration,
    SharedConfigWriteData,
} from 'uhk-common';

import { MainServiceBase } from './main-service-base';

const CHANGE_DEBOUNCE_MS = 500;
const POLL_INTERVAL_MS = 3000;
const ACKNOWLEDGED_CONTENT_HASH_SETTING = 'shared-config-acknowledged-content-hash';

export class SharedConfigService extends MainServiceBase {
    private filePath?: string;
    private detectChanges = false;
    private watcher?: FSWatcher;
    private pollTimer?: NodeJS.Timeout;
    private changeTimer?: NodeJS.Timeout;
    /**
     * Hash of the content the user last applied or ignored. Persisted so that a change made
     * while Agent was not running is still detected on the next startup.
     */
    private acknowledgedContentHash?: string;
    /**
     * Hash of the content currently offered to the user. Used to avoid offering the same
     * content repeatedly while it waits for the user's decision.
     */
    private pendingContentHash?: string;
    private configurationId = 0;
    private isChecking = false;

    constructor(protected logService: LogService,
                protected win: Electron.BrowserWindow) {
        super(logService, win);

        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        ipcMain.handle(IpcEvents.sharedConfig.configure, this.configure.bind(this));
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        ipcMain.handle(IpcEvents.sharedConfig.write, this.write.bind(this));
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        ipcMain.handle(IpcEvents.sharedConfig.acknowledge, this.acknowledge.bind(this));

        logService.misc('[SharedConfigService] init success');
    }

    dispose(): void {
        this.stopWatching();
    }

    private async configure(_event: Electron.IpcMainInvokeEvent,
                            configuration: SharedConfigConfiguration): Promise<void> {
        // Bump the configuration id so an in-flight configure() cannot re-enable watching
        // after a newer configuration (for example unchecking the checkbox) took over.
        const configurationId = ++this.configurationId;

        this.stopWatching();
        this.filePath = configuration?.filePath;
        this.detectChanges = !!configuration?.detectChanges;
        this.pendingContentHash = undefined;

        if (!this.filePath) {
            this.logService.misc('[SharedConfigService] disabled, no shared configuration file path');
            return;
        }

        const content = await this.readContent(this.filePath);
        if (configurationId !== this.configurationId) {
            this.logService.misc('[SharedConfigService] superseded configuration, ignoring');
            return;
        }

        const contentHash = this.hashContent(content);
        const acknowledgedContentHash = await this.getAcknowledgedContentHash();

        if (acknowledgedContentHash === undefined) {
            // First time this file is seen: establish a baseline without prompting. From now on
            // any difference between the file and this baseline is reported.
            if (contentHash !== undefined) {
                await this.setAcknowledgedContentHash(contentHash);
            }
        } else if (this.detectChanges && contentHash !== undefined && contentHash !== acknowledgedContentHash) {
            // The file changed while Agent was not running. Offer it on startup.
            this.pendingContentHash = contentHash;
            this.notifyChange(content);
        }

        this.logService.misc(
            `[SharedConfigService] configured, filePath: ${this.filePath}, detectChanges: ${this.detectChanges}`);

        if (this.detectChanges) {
            this.startWatching();
        }
    }

    private async write(_event: Electron.IpcMainInvokeEvent, data: SharedConfigWriteData): Promise<void> {
        if (!this.filePath) {
            return;
        }

        const buffer = Buffer.from(data.content, 'base64');
        await fs.writeFile(this.filePath, buffer);

        // An exported configuration is, by definition, already known to the user.
        const contentHash = this.hashContent(data.content);
        if (contentHash !== undefined) {
            await this.setAcknowledgedContentHash(contentHash);
        }
        this.pendingContentHash = undefined;
        this.logService.misc(`[SharedConfigService] wrote shared configuration: ${this.filePath}`);
    }

    private async acknowledge(_event: Electron.IpcMainInvokeEvent, data: SharedConfigAcknowledgeData): Promise<void> {
        if (!data?.content) {
            return;
        }

        const contentHash = this.hashContent(data.content);
        if (contentHash === undefined) {
            return;
        }

        await this.setAcknowledgedContentHash(contentHash);
        if (this.pendingContentHash === contentHash) {
            this.pendingContentHash = undefined;
        }
        this.logService.misc('[SharedConfigService] acknowledged shared configuration change');
    }

    private startWatching(): void {
        if (!this.filePath) {
            return;
        }

        const directory = dirname(this.filePath);
        const fileName = basename(this.filePath);

        try {
            this.watcher = watch(directory, (_eventType, changedFile) => {
                if (changedFile && changedFile.toString() !== fileName) {
                    return;
                }

                this.scheduleChangeCheck();
            });
            this.watcher.on('error', error => {
                this.logService.error('[SharedConfigService] watcher error', error);
            });
            this.logService.misc(`[SharedConfigService] watching: ${this.filePath}`);
        } catch (error) {
            this.logService.error('[SharedConfigService] failed to watch shared configuration', error);
        }

        // Poll as a fallback: not every filesystem, sync client or network share delivers
        // reliable change events, so never rely on fs.watch alone for detection.
        this.pollTimer = setInterval(() => {
            this.handleExternalChange();
        }, POLL_INTERVAL_MS);
    }

    private stopWatching(): void {
        if (this.changeTimer) {
            clearTimeout(this.changeTimer);
            this.changeTimer = undefined;
        }

        if (this.pollTimer) {
            clearInterval(this.pollTimer);
            this.pollTimer = undefined;
        }

        if (this.watcher) {
            this.watcher.close();
            this.watcher = undefined;
        }
    }

    private scheduleChangeCheck(): void {
        // Coalesce bursts of events into a single check, but do not reset the timer on every
        // event: a file that is written continuously would otherwise keep pushing the check
        // into the future and no change would ever be reported.
        if (this.changeTimer) {
            return;
        }

        this.changeTimer = setTimeout(() => {
            this.changeTimer = undefined;
            this.handleExternalChange();
        }, CHANGE_DEBOUNCE_MS);
    }

    private async handleExternalChange(): Promise<void> {
        if (this.isChecking || !this.filePath || !this.detectChanges) {
            return;
        }

        this.isChecking = true;
        try {
            const content = await this.readContent(this.filePath);
            if (content === undefined) {
                return;
            }

            const contentHash = this.hashContent(content);
            if (contentHash === undefined) {
                return;
            }

            const acknowledgedContentHash = await this.getAcknowledgedContentHash();
            if (contentHash === acknowledgedContentHash || contentHash === this.pendingContentHash) {
                return;
            }

            this.pendingContentHash = contentHash;
            this.notifyChange(content);
        } catch (error) {
            this.logService.error('[SharedConfigService] failed to handle shared configuration change', error);
        } finally {
            this.isChecking = false;
        }
    }

    private notifyChange(content: string): void {
        if (!this.filePath) {
            return;
        }

        this.logService.misc(`[SharedConfigService] external change detected: ${this.filePath}`);

        const applyData: SharedConfigApplyData = {
            filePath: this.filePath,
            fileName: basename(this.filePath),
            content,
        };
        this.sendIpcToWindow(IpcEvents.sharedConfig.changeDetected, applyData);
    }

    private async readContent(filePath: string): Promise<string | undefined> {
        try {
            const buffer = await fs.readFile(filePath);

            return buffer.toString('base64');
        } catch (error) {
            if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
                this.logService.error(`[SharedConfigService] failed to read ${filePath}`, error);
            }

            return undefined;
        }
    }

    private hashContent(content?: string): string | undefined {
        if (content === undefined) {
            return undefined;
        }

        return createHash('sha256').update(content).digest('hex');
    }

    private async getAcknowledgedContentHash(): Promise<string | undefined> {
        const value = await settings.get(ACKNOWLEDGED_CONTENT_HASH_SETTING);

        return typeof value === 'string' && value.length > 0 ? value : undefined;
    }

    private async setAcknowledgedContentHash(contentHash: string): Promise<void> {
        await settings.set(ACKNOWLEDGED_CONTENT_HASH_SETTING, contentHash);
    }
}
