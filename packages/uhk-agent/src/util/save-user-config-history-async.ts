import { writeFile } from 'fs';
import { join } from 'path';
import { promisify } from 'util';
import { getUserConfigHistoryFilename } from 'uhk-common';

import { getUserConfigHistoryDirAsync } from './get-user-config-history-dir-async';

const writeFileAsync = promisify(writeFile);

export async function saveUserConfigHistoryAsync(buffer: Buffer): Promise<void> {
    const filename = getUserConfigHistoryFilename();
    const filePath = join(await getUserConfigHistoryDirAsync(), filename);

    return writeFileAsync(filePath, buffer, { encoding: 'ascii' });
}
