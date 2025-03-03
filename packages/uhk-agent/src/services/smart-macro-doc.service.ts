import fastifyStatic from '@fastify/static';
import { ipcMain } from 'electron';
import fse from 'fs-extra';
import getPort from 'get-port';
import { join } from 'path';
import fastify, { FastifyInstance } from 'fastify';
import { FirmwareRepoInfo, IpcEvents, LogService } from 'uhk-common';
import { getPackageJsonFromPathAsync } from 'uhk-usb';
import { downloadSmartMacroDoc, downloadSmartMacroReferenceManual, REFERENCE_MANUAL_FILE_NAME } from 'uhk-smart-macro';

import {
    copySmartMacroDocToWebserver,
    copySmartMacroLoadingHtml,
    getDefaultFirmwarePath,
    getSmartMacroDocRootPath,
    makeFolderWriteableToUserOnLinux
} from '../util';
import { QueueManager } from './queue-manager';

const LOG_PREFIX = '[SmartMacroService]';

export class SmartMacroDocService {
    private _isRunning = false;
    private port: number;
    private queueManager = new QueueManager();
    private staticServer: FastifyInstance;
    private readonly rootPath: string;

    constructor(private logService: LogService,
                private rootDir: string) {
        this.rootPath = getSmartMacroDocRootPath();
        ipcMain.on(IpcEvents.app.getAppStartInfo, (...args: any[]) => {
            this.queueManager.add({
                method: this.handleAppStartInfo,
                bind: this,
                params: args,
                asynchronous: true
            });
        });
        ipcMain.on(IpcEvents.smartMacroDoc.downloadDocumentation, (...args: any[]) => {
            this.queueManager.add({
                method: this.handleDownloadDocumentation,
                bind: this,
                params: args,
                asynchronous: true
            });
        });
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
            await makeFolderWriteableToUserOnLinux(getSmartMacroDocRootPath());
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

    private async downloadDocumentation(event: Electron.IpcMainEvent, firmwareRepoInfo: FirmwareRepoInfo): Promise<void> {
        this.logService.misc(serviceLogMessage('start downloading firmware documentation'), firmwareRepoInfo);
        const [owner, repo] = firmwareRepoInfo.firmwareGitRepo.split('/');
        const downloadDirectory = join(this.rootPath, owner, repo, firmwareRepoInfo.firmwareGitTag);
        const indexHtmlPath = join(downloadDirectory, 'index.html');

        if (!await fse.pathExists(indexHtmlPath)) {
            this.logService.misc(serviceLogMessage('firmware documentation downloading'));

            await downloadSmartMacroDoc({
                owner,
                repo,
                ref: firmwareRepoInfo.firmwareGitTag,
                directory: downloadDirectory
            });

            this.logService.misc(serviceLogMessage('firmware documentation downloaded'));
        }
        else {
            this.logService.misc(serviceLogMessage('firmware documentation downloaded earlier'));
        }

        event.sender.send(IpcEvents.smartMacroDoc.downloadDocumentationReply, firmwareRepoInfo);

        const docDevDirectory = join(downloadDirectory, 'doc-dev');
        if (!await fse.pathExists(docDevDirectory)) {
            this.logService.misc(serviceLogMessage('reference manual downloading'));

            await downloadSmartMacroReferenceManual({
                owner,
                repo,
                ref: firmwareRepoInfo.firmwareGitTag,
                directory: docDevDirectory,
            });

            this.logService.misc(serviceLogMessage('reference manual downloaded'));
        }
        else {
            this.logService.misc(serviceLogMessage('reference manual downloaded earlier'));
        }

        const referenceManualPath = join(docDevDirectory, REFERENCE_MANUAL_FILE_NAME);
        const referenceManual = await fse.readFile(referenceManualPath, 'utf8');
        event.sender.send(IpcEvents.smartMacroDoc.referenceManualReply, referenceManual);
    }

    private async fallbackToBundledFirmware(event: Electron.IpcMainEvent): Promise<void> {
        this.logService.misc(serviceLogMessage('fallback to bundled firmware documentation'));
        try {
            const { packageJsonPath } = getDefaultFirmwarePath(this.rootDir);
            const { gitInfo } = await getPackageJsonFromPathAsync(packageJsonPath);
            const firmwareRepoInfo: FirmwareRepoInfo = {
                firmwareGitRepo: gitInfo.repo,
                firmwareGitTag: gitInfo.tag,
            }
            await this.downloadDocumentation(event, firmwareRepoInfo)
        }
        catch (error) {
            this.logService.error(serviceLogMessage('failed to fallback to bundled documentation'), error);
        }
    }

    private async handleAppStartInfo(event: Electron.IpcMainEvent): Promise<void> {
        this.logService.misc(serviceLogMessage('getAppStartInfo'));

        event.sender.send(IpcEvents.smartMacroDoc.serviceListening, this.port);
    }

    private async handleDownloadDocumentation(event: Electron.IpcMainEvent, args: Array<any>): Promise<void> {
        try {
            const firmwareRepoInfo: FirmwareRepoInfo = args[0];
            if (!firmwareRepoInfo.firmwareGitRepo || !firmwareRepoInfo.firmwareGitTag) {
                this.logService.misc(serviceLogMessage('fallback to bundled firmware documentation because git repo or tag missing'), firmwareRepoInfo);
                return this.fallbackToBundledFirmware(event);
            }

            return this.downloadDocumentation(event, firmwareRepoInfo);
        } catch (error) {
            this.logService.error(serviceLogMessage('download running firmware documentation failed'), error);
            return this.fallbackToBundledFirmware(event);
        }
    }
}

function serviceLogMessage(message: string): string {
    return `${LOG_PREFIX} ${message}`;
}
