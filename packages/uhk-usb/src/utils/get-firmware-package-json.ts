import { exists } from 'fs';
import { readFile } from 'fs/promises';
import md5 from 'md5';
import { join } from 'path';
import { promisify } from 'util';
import { FirmwareJson } from 'uhk-common';

import { TmpFirmware } from '../models/tmp-firmware.js';
import { getPackageJsonFromPathAsync } from './get-package-json-from-path-async.js';

const existsAsync = promisify(exists);

export async function getFirmwarePackageJson(firmwarePathData: TmpFirmware): Promise<FirmwareJson> {
    if (!(await existsAsync(firmwarePathData.packageJsonPath))) {
        throw new Error(`Cannot found the package.json of the firmware ${firmwarePathData.packageJsonPath}`);
    }

    const packageJson = await getPackageJsonFromPathAsync(firmwarePathData.packageJsonPath);
    packageJson.path = firmwarePathData.packageJsonPath;

    await extendWithFirmwareChecksum(packageJson, 'devices', firmwarePathData.tmpDirectory);
    await extendWithFirmwareChecksum(packageJson, 'modules', firmwarePathData.tmpDirectory);

    return packageJson;
}

async function extendWithFirmwareChecksum(packageJson: any, sectionName: string, firmwareDir: string): Promise<void> {
    const section = packageJson[sectionName];

    if (!section) {
        throw new Error(`Cannot found "${section}" section of the package.json of the firmware`);
    }

    const sectionDir = join(firmwareDir, sectionName);
    if (!(await existsAsync(sectionDir))) {
        throw new Error(`Cannot found directory of the firmware "${sectionName}"`);
    }

    for (const item of section) {
        const filePath = sectionName === 'devices'
            ? join(sectionDir, item.name, 'firmware.hex')
            : join(sectionDir, `${item.name}.bin`);

        item.checksum = await getChecksum(filePath);
    }
}

async function getChecksum(filePath: string): Promise<string> {
    const fileContent = await readFile(filePath, { encoding: 'binary'});
    return md5(fileContent);
}
