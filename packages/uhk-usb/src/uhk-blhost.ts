import * as path from 'path';
import { spawn } from 'child_process';
import { LogService } from 'uhk-common';
import { retry } from './util';

export class UhkBlhost {
    private blhostPath: string;

    constructor(private logService: LogService,
                private rootDir: string) {
    }

    public async runBlhostCommand(params: Array<string>): Promise<void> {
        const self = this;
        return new Promise<void>((resolve, reject) => {
            const blhostPath = this.getBlhostPath();
            self.logService.debug(`[blhost] RUN: ${blhostPath} ${params.join(' ')}`);
            const childProcess = spawn(`"${blhostPath}"`, params, {shell: true});
            let finished = false;

            childProcess.stdout.on('data', data => {
                self.logService.debug(`[blhost] STDOUT: ${data}`);
            });

            childProcess.stderr.on('data', data => {
                self.logService.error(`[blhost] STDERR: ${data}`);
            });

            childProcess.on('close', code => {
                self.logService.debug(`[blhost] CLOSE_CODE: ${code}`);
                finish(code);
            });

            childProcess.on('exit', code => {
                self.logService.debug(`[blhost] EXIT_CODE: ${code}`);
                finish(code);
            });

            childProcess.on('error', err => {
                self.logService.debug(`[blhost] ERROR: ${err}`);
            });

            function finish(code) {
                if (finished) {
                    return;
                }

                finished = true;

                self.logService.debug(`[blhost] FINISHED: ${code}`);

                if (code !== null && code !== 0) {
                    return reject(new Error(`blhost error code:${code}`));
                }

                resolve();
            }
        });
    }

    public async runBlhostCommandRetry(params: Array<string>, maxTry = 100): Promise<void> {
        return await retry(async () => await this.runBlhostCommand(params), maxTry, this.logService);
    }

    private getBlhostPath(): string {
        if (this.blhostPath) {
            return this.blhostPath;
        }

        let blhostPath;
        switch (process.platform) {
            case 'linux':
                blhostPath = 'linux/x86_64/blhost';
                break;
            case 'darwin':
                blhostPath = 'mac/blhost';
                break;
            case 'win32':
                blhostPath = 'win/blhost.exe';
                break;
            default:
                throw new Error(`Could not find blhost path. Unknown platform:${process.platform}`);
        }

        this.blhostPath = path.join(this.rootDir, `packages/blhost/${blhostPath}`);

        return this.blhostPath;
    }
}
