import { writeFile } from 'fs';
import { join } from 'path';
import { promisify } from 'util';

import { getUserConfigHistoryDirAsync } from './get-user-config-history-dir-async';

const writeFileAsync = promisify(writeFile);

export async function saveUserConfigHistoryAsync(buffer: Buffer): Promise<void> {
    const date = new Date();

    // tslint:disable-next-line:max-line-length
    const filename = `${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}-${date.getHours()}${date.getMinutes()}${date.getSeconds()}.bin`;
    const filePath = join(await getUserConfigHistoryDirAsync(), filename);

    return writeFileAsync(filePath, buffer, { encoding: 'ascii' });
}
