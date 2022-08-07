import fastifyStatic from '@fastify/static';
import delay from 'delay';
import { ipcMain } from 'electron';
import getPort from 'get-port';
import { join } from 'path';
import fastify, { FastifyInstance } from 'fastify';
import { IpcEvents, LogService } from 'uhk-common';

const LOG_PREFIX = '[SmartMacroService]';

export class SmartMacroDocService {
    private _isRunning = false;
    private port: number;
    private staticServer: FastifyInstance;
    private readonly rootPath: string;

    constructor(private logService: LogService,
                private rootDir: string) {
        this.rootPath = join(this.rootDir, 'smart-macro-docs');
        ipcMain.on(IpcEvents.app.getAppStartInfo, this.handleAppStartInfo.bind(this));
        ipcMain.on(IpcEvents.smartMacroDoc.downloadDocumentation, this.handleDownloadDocumentation.bind(this));
    }

    public get isRunning(): boolean {
        return this._isRunning;
    }

    async start(): Promise<void> {
        try {
            this.logService.misc(serviceLogMessage('starting...'));

            this.port = await getPort();
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

    private async handleDownloadDocumentation(event: Electron.IpcMainEvent): Promise<void> {
        this.logService.misc(serviceLogMessage('start download firmware documentation'));

        await delay(250);
        // TODO: Implement download not bundled doc
        this.logService.misc(serviceLogMessage('firmware documentation downloaded'));
        event.sender.send(IpcEvents.smartMacroDoc.downloadDocumentationReply);
    }
}

function serviceLogMessage(message: string): string {
    return `${LOG_PREFIX} ${message}`;
}
