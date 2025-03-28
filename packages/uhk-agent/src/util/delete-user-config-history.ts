import { readdir, rm, stat } from 'node:fs/promises';
import path from 'node:path';
import { IpcResponse } from "uhk-common";

import { getUserConfigHistoryDirAsync } from './get-user-config-history-dir-async';

export async function deleteUserConfigHistory(deviceUniqueId: number): Promise<IpcResponse> {
    const response: IpcResponse = {
        success: true,
    }

    try {
        const userConfigHistoryDir = await getUserConfigHistoryDirAsync();
        const entries = await readdir(userConfigHistoryDir);

        for (const entry of entries) {
            const filePath = path.join(userConfigHistoryDir, entry);
            const entryStat = await stat(filePath);

            if (entryStat.isDirectory()) {
                const entrySplit = entry.split('-');

                if (entrySplit.length !== 2) {
                    continue;
                }

                const deviceId = Number.parseInt(entrySplit[0], 10);

                if (isNaN(deviceId)) {
                    continue;
                }

                console.log('delete-user-config-history-dir', { deviceId, deviceUniqueId});
                if (deviceId === deviceUniqueId) {
                    await rm(filePath, {recursive: true});

                    return response;
                }
            }
        }

        return response;
    } catch (e) {
        response.success = false;
        response.error = {
            message: e.message,
        }
    }
}
