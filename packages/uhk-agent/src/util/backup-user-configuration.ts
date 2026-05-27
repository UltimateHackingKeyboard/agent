import { app } from 'electron';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import {
    BackupUserConfiguration,
    BackupUserConfigurationInfo,
    convertDateToDisplayText,
    LogService,
    SaveUserConfigurationData,
    shouldUpgradeAgent,
    UserConfiguration,
} from 'uhk-common';
import { pathExists } from 'uhk-fs';

import { loadUserConfigFromBinaryFile } from './load-user-config-from-binary-file';
import { loadUserConfigHistoryAsync } from './load-user-config-history-async';

export const getBackupUserConfigurationPath = (uniqueId: number): string => {
    const appDataDir = app.getPath('userData');

    return path.join(appDataDir, `${uniqueId}.json`);
};

export const backupUserConfiguration = (data: SaveUserConfigurationData): Promise<void> => {
    const backupFilePath = getBackupUserConfigurationPath(data.uniqueId);
    const fileContent = JSON.stringify(data.configuration, null, 2);
    return fs.writeFile(backupFilePath, fileContent, { encoding: 'utf-8' });
};

export async function getBackupUserConfigurationContent(logService: LogService, uniqueId: number): Promise<BackupUserConfiguration> {
    try {
        const backupFilePath = getBackupUserConfigurationPath(uniqueId);

        if (await pathExists(backupFilePath)) {
            try {
                const fileContent = await fs.readFile(backupFilePath, { encoding: 'utf-8' });
                const json = JSON.parse(fileContent);
                const config = new UserConfiguration().fromJsonObject(json);

                if (!shouldUpgradeAgent(config.getSemanticVersion(), false)) {
                    logService.config('Backup user configuration', config);

                    const stat = await fs.stat(backupFilePath);

                    return {
                        date: convertDateToDisplayText(stat.mtime),
                        info: BackupUserConfigurationInfo.LastCompatible,
                        userConfiguration: json
                    };
                }
            } catch (error) {
                logService.error('Cannot parse backup user config', error);
            }
        }

        const fromHistory = await getCompatibleUserConfigFromHistory(logService, uniqueId);
        if (fromHistory) {
            logService.config('Backup user configuration from history', fromHistory.userConfiguration);
            return fromHistory;
        }

        logService.misc('No backup user configuration');

        return {
            info: BackupUserConfigurationInfo.NotExists
        };
    } catch (error) {
        logService.error('Can not load backup user configuration for device', { uniqueId, error });
    }
}

export async function getCompatibleUserConfigFromHistory(logService: LogService, uniqueId: number): Promise<BackupUserConfiguration> {
    const history = await loadUserConfigHistoryAsync();

    const deviceHistory = history.devices.find(device => device.uniqueId === uniqueId);

    const files = deviceHistory
        ? [...deviceHistory.files, ...history.commonFiles]
        : history.commonFiles;

    for (const file of files) {
        try {
            const userConfig = await loadUserConfigFromBinaryFile(file.filePath);

            if (shouldUpgradeAgent(userConfig.getSemanticVersion(), false)) {
                continue;
            }

            return {
                info: BackupUserConfigurationInfo.EarlierCompatible,
                userConfiguration: userConfig.toJsonObject(),
                date: file.timestamp,
            };
        } catch (error) {
            logService.error('Cannot parse backup user config from history', error);
        }
    }
}
