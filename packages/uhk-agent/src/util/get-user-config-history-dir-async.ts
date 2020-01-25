import { app } from 'electron';
import { ensureDir } from 'fs-extra';
import { join } from 'path';

export async function getUserConfigHistoryDirAsync(): Promise<string> {
    const dir = join(app.getPath('userData'), 'user-configs');

    await ensureDir(dir);

    return dir;
}
