import fs from 'fs';
import path from 'path';
import {TmpFirmware} from 'uhk-usb';

function getPackageJsonFirmwarePath(rootDir: string): string {
    const packageJsonPath = path.join(rootDir, 'packages/firmware/package.json');

    if (fs.existsSync(packageJsonPath)) {
        return packageJsonPath;
    }

    throw new Error(`Could not found package.json of firmware ${packageJsonPath}`);
}

export function getDefaultFirmwarePath(rootDir: string): TmpFirmware {
    return {
        packageJsonPath: getPackageJsonFirmwarePath(rootDir),
        tmpDirectory: path.join(rootDir, 'packages/firmware')
    };
}
