import { readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import {
    convertHistoryFilenameToDisplayText,
    DeviceUserConfigHistory,
    getMd5HashFromFilename,
    sortStringDesc,
    UHK_DEVICES,
    UNKNOWN_DEVICE,
    UserConfigHistory,
} from 'uhk-common';

import { getUserConfigHistoryDirAsync } from './get-user-config-history-dir-async';
import { loadUserConfigFromBinaryFile } from './load-user-config-from-binary-file';

export async function loadUserConfigHistoryAsync(): Promise<UserConfigHistory> {
    const history: UserConfigHistory = {
        commonFiles: [],
        devices: []
    };

    const userConfigHistoryDir = await getUserConfigHistoryDirAsync();
    const entries = await readdir(userConfigHistoryDir);

    for (const entry of entries) {
        const filePath = path.join(userConfigHistoryDir, entry);
        const entryStat = await stat(filePath);

        if (entryStat.isFile()) {
            if (path.extname(entry) === '.bin') {
                history.commonFiles.push({
                    filePath,
                    md5Hash: getMd5HashFromFilename(entry),
                    timestamp: convertHistoryFilenameToDisplayText(entry),
                });
            }
        } else if (entryStat.isDirectory()) {
            const entrySplit = entry.split('-');

            if (entrySplit.length !== 2) {
                continue;
            }

            const deviceId = Number.parseInt(entrySplit[1], 10);

            if (isNaN(deviceId)) {
                continue;
            }

            const deviceHistoryDir = path.join(userConfigHistoryDir, entry);
            const deviceHistory: DeviceUserConfigHistory = {
                uniqueId: Number.parseInt(entrySplit[0], 10),
                device: UHK_DEVICES.find(device => device.id === deviceId) || UNKNOWN_DEVICE,
                deviceName: '',
                files: (await readdir(deviceHistoryDir))
                    .filter(file => path.extname(file) === '.bin')
                    .sort(sortStringDesc)
                    .map(file => {
                        return {
                            filePath: path.join(deviceHistoryDir, file),
                            md5Hash: getMd5HashFromFilename(file),
                            timestamp: convertHistoryFilenameToDisplayText(file),
                        };
                    }),
            };

            for (const file of deviceHistory.files) {
                try {
                    const userConfig = await loadUserConfigFromBinaryFile(file.filePath);
                    deviceHistory.deviceName = userConfig.deviceName;
                    break;
                } catch {
                    // Maybe the user config is newer than Agent supports, or corrupted.
                }
            }

            history.devices.push(deviceHistory);
        }
    }

    history.commonFiles
        .sort((a, b) => sortStringDesc(a.timestamp, b.timestamp));

    return history;
}
