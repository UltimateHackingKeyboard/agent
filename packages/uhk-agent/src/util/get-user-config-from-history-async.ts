import { readFile } from 'fs';
import { join } from 'path';
import { promisify } from 'util';

import { getUserConfigHistoryDirAsync } from './get-user-config-history-dir-async';

const readFileAsync = promisify(readFile);

export async function getUserConfigFromHistoryAsync(filename: string): Promise<Array<number>> {
    const filePath = join(await getUserConfigHistoryDirAsync(), filename);

    return [...Buffer.from(await readFileAsync(filePath, { encoding: 'ascii' }), 'ascii')];
}
