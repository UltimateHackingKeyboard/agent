import { readdir } from 'fs';
import { promisify } from 'util';

import { getUserConfigHistoryDirAsync } from './get-user-config-history-dir-async';

const readdirAsync = promisify(readdir);

export async function loadUserConfigHistoryAsync(): Promise<Array<string>> {
    const files = await readdirAsync(await getUserConfigHistoryDirAsync());

    return files;
}
