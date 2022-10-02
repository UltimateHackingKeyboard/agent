import fastifyStatic from '@fastify/static';
import { ipcMain } from 'electron';
import fse from 'fs-extra';
import getPort from 'get-port';
import { join } from 'path';
import fastify, { FastifyInstance } from 'fastify';
import { FirmwareRepoInfo, IpcEvents, LogService } from 'uhk-common';
import { downloadSmartMacroDoc } from 'uhk-smart-macro';

import {
    copySmartMacroDocToWebserver,
    copySmartMacroLoadingHtml,
    getDefaultFirmwarePath,
    getSmartMacroDocRootPath
} from '../util';

const LOG_PREFIX = '[SmartMacroService]';

export class SmartMacroDocService {
    private _isRunning = false;
    private port: number;
    private staticServer: FastifyInstance;
    private readonly rootPath: string;

    constructor(private logService: LogService,
                private rootDir: string) {
        this.rootPath = getSmartMacroDocRootPath();
        ipcMain.on(IpcEvents.app.getAppStartInfo, this.handleAppStartInfo.bind(this));
        ipcMain.on(IpcEvents.smartMacroDoc.downloadDocumentation, this.handleDownloadDocumentation.bind(this));
    }

    public get isRunning(): boolean {
        return this._isRunning;
    }

    async start(): Promise<void> {
        try {
            this.logService.misc(serviceLogMessage('starting...'));
            const firmwarePathData = getDefaultFirmwarePath(this.rootDir);
            await copySmartMacroDocToWebserver(firmwarePathData, this.logService);
            await copySmartMacroLoadingHtml(this.rootDir, this.logService);
            this.logService.misc(serviceLogMessage('get free TCP port'));
            this.port = await getPort();
            this.logService.misc(serviceLogMessage(`acquired TCP port: ${this.port}`));
            this.staticServer = fastify();
            this.staticServer.register(fastifyStatic, {
                root: this.rootPath,
                prefix: '/'
            });
            await this.staticServer.listen({
                port: this.port
            });
            this.logService.misc(serviceLogMessage(`started on ${this.port}.`));
            this._isRunning = true;

        } catch (err) {
            this.logService.error(serviceLogMessage(`can't be started on ${this.port}`), err);

            throw err;
        }
    }

    async stop(): Promise<void> {
        this.logService.misc(serviceLogMessage('stopping...'));

        await this.staticServer.close();
        this._isRunning = false;

        this.logService.misc(serviceLogMessage('stopped.'));
    }

    private async handleAppStartInfo(event: Electron.IpcMainEvent): Promise<void> {
        this.logService.misc(serviceLogMessage('getAppStartInfo'));

        event.sender.send(IpcEvents.smartMacroDoc.serviceListening, this.port);
    }

    private async handleDownloadDocumentation(event: Electron.IpcMainEvent, args: Array<any>): Promise<void> {
        const firmwareRepoInfo: FirmwareRepoInfo = args[0];
        this.logService.misc(serviceLogMessage('start download firmware documentation'), firmwareRepoInfo);
        const [owner, repo] = firmwareRepoInfo.firmwareGitRepo.split('/');
        const downloadDirectory = join(this.rootPath, owner, repo, firmwareRepoInfo.firmwareGitTag);

        if (!await fse.pathExists(downloadDirectory)) {
            await downloadSmartMacroDoc({
                owner,
                repo,
                ref: firmwareRepoInfo.firmwareGitTag,
                directory: downloadDirectory
            });
        }

        this.logService.misc(serviceLogMessage('firmware documentation downloaded'));
        event.sender.send(IpcEvents.smartMacroDoc.downloadDocumentationReply);
    }
}

function serviceLogMessage(message: string): string {
    return `${LOG_PREFIX} ${message}`;
}
