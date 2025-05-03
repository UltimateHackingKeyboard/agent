import { app } from 'electron';
import * as fs from 'fs-extra';
import * as path from 'path';
import {
    BackupUserConfiguration,
    BackupUserConfigurationInfo,
    convertDateToDisplayText,
    LogService,
    SaveUserConfigurationData,
    shouldUpgradeAgent,
    UserConfiguration,
} from 'uhk-common';

import { loadUserConfigFromBinaryFile } from './load-user-config-from-binary-file';
import { loadUserConfigHistoryAsync } from './load-user-config-history-async';

export const getBackupUserConfigurationPath = (uniqueId: number): string => {
    const appDataDir = app.getPath('userData');

    return path.join(appDataDir, `${uniqueId}.json`);
};

export const backupUserConfiguration = (data: SaveUserConfigurationData): Promise<void> => {
    const backupFilePath = getBackupUserConfigurationPath(data.uniqueId);
    return fs.writeJSON(backupFilePath, data.configuration, {spaces: 2});
};

export async function getBackupUserConfigurationContent(logService: LogService, uniqueId: number): Promise<BackupUserConfiguration> {
    try {
        const backupFilePath = getBackupUserConfigurationPath(uniqueId);

        if (await fs.pathExists(backupFilePath)) {
            try {
                const json = await fs.readJSON(backupFilePath);
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
    let history = await loadUserConfigHistoryAsync();

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
