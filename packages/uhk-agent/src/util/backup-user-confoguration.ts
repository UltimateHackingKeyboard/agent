import { app } from 'electron';
import { LogService, UserConfiguration, SaveUserConfigurationData } from 'uhk-common';
import * as path from 'path';
import * as fs from 'fs-extra';

export const getBackupUserConfigurationPath = (uniqueId: number): string => {
    const appDataDir = app.getPath('userData');

    return path.join(appDataDir, `${uniqueId}.json`);
};

export const backupUserConfiguration = (data: SaveUserConfigurationData): Promise<void> => {
    const backupFilePath = getBackupUserConfigurationPath(data.uniqueId);
    return fs.writeJSON(backupFilePath, data.configuration, {spaces: 2});
};

export const getBackupUserConfigurationContent = async (logService: LogService, uniqueId: number): Promise<UserConfiguration> => {
    try {
        const backupFilePath = getBackupUserConfigurationPath(uniqueId);

        if (await fs.pathExists(backupFilePath)) {
            const json = await fs.readJSON(backupFilePath);
            const config = new UserConfiguration().fromJsonObject(json);
            logService.config('Backup user configuration', config);

            return json;
        }

        logService.misc('No backup user configuration');

        return null;
    } catch (error) {
        logService.error('Can not load backup user configuration for device', {uniqueId, error});
    }
};
