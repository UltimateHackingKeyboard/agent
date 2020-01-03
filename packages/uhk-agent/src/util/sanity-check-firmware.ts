import { gt } from 'semver';
import { exists } from 'fs';
import { join } from 'path';
import { promisify } from 'util';

import { TmpFirmware } from '../models/tmp-firmware';
import { getPackageJsonFromPathAsync } from './get-package-json-from-path-async';

const existsAsync = promisify(exists);

export async function sanityCheckFirmwareAsync(firmwarePathData: TmpFirmware): Promise<void> {
    if (!(await existsAsync(firmwarePathData.packageJsonPath))) {
        throw new Error(`Cannot found the package.json of the firmware ${firmwarePathData.packageJsonPath}`);
    }

    const packageJson = await getPackageJsonFromPathAsync(firmwarePathData.packageJsonPath);

    await checkPackageJsonSection(packageJson, 'devices', firmwarePathData.tmpDirectory);
    await checkPackageJsonSection(packageJson, 'modules', firmwarePathData.tmpDirectory);
}

async function checkPackageJsonSection(packageJson: any, sectionName: string, firmwareDir: string): Promise<void> {
    const section = packageJson[sectionName];

    if (!section) {
        throw new Error(`Cannot found "${section}" section of the package.json of the firmware`);
    }

    if (gt(packageJson.firmwareVersion, '8.7.0')) {
        await checkSourceExists(section, sectionName, firmwareDir);
    }
}

async function checkSourceExists(data: Array<{ source: string }>, sectionName: string, firmwareDir: string): Promise<void> {
    for (const entry of data) {
        const filePath = join(firmwareDir, sectionName, entry.source);
        if (!(await existsAsync(filePath))) {
            throw new Error(`Cannot found source of the firmware ${filePath}`);
        }
    }
}
