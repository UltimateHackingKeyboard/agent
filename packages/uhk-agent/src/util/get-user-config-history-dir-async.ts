import { app } from 'electron';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';

export async function getUserConfigHistoryDirAsync(): Promise<string> {
    const dir = join(app.getPath('userData'), 'user-configs');

    await mkdir(dir, { recursive: true });

    return dir;
}
