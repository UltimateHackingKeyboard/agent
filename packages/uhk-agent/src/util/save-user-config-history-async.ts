import { ensureDir } from 'fs-extra';
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { createMd5Hash, getUserConfigHistoryFilename, Buffer } from 'uhk-common';

import { getUserConfigHistoryDirAsync } from './get-user-config-history-dir-async';


export async function saveUserConfigHistoryAsync(buffer: Buffer, deviceId: number, uniqueId: number): Promise<void> {
    const deviceDir = `${uniqueId}-${deviceId}`;
    const deviceDirPath = join(await getUserConfigHistoryDirAsync(), deviceDir);
    await ensureDir(deviceDirPath);
    const md5Hash = createMd5Hash(buffer);
    const filename = getUserConfigHistoryFilename(md5Hash);
    const filePath = join(deviceDirPath, filename);

    return writeFile(filePath, buffer, { encoding: 'ascii' });
}
