import { writeFile } from 'fs';
import { join } from 'path';
import { promisify } from 'util';
import { createMd5Hash, getUserConfigHistoryFilename, Buffer } from 'uhk-common';

import { getUserConfigHistoryDirAsync } from './get-user-config-history-dir-async';

const writeFileAsync = promisify(writeFile);

export async function saveUserConfigHistoryAsync(buffer: Buffer): Promise<void> {
    const md5Hash = createMd5Hash(buffer);
    const filename = getUserConfigHistoryFilename(md5Hash);
    const filePath = join(await getUserConfigHistoryDirAsync(), filename);

    return writeFileAsync(filePath, buffer, { encoding: 'ascii' });
}
