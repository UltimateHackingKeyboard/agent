import fs from 'node:fs/promises';
import path from 'node:path';

const rootPackageJsonPath = path.join(import.meta.dirname, '../../../package.json');
const packageJsonContent = await fs.readFile(rootPackageJsonPath, { encoding: 'utf8' });
const packageJson = JSON.parse(packageJsonContent)

const versionsFileContent = `\
import { VersionInformation } from '../models/version-information.js';

export const VERSIONS: VersionInformation = {
    version: ${writeValue(packageJson.version)},
    firmwareVersion: ${writeValue(packageJson.firmwareVersion)},
    deviceProtocolVersion: ${writeValue(packageJson.deviceProtocolVersion)},
    userConfigVersion: ${writeValue(packageJson.userConfigVersion)},
    hardwareConfigVersion: ${writeValue(packageJson.hardwareConfigVersion)},
}
`

const versionsFilePath = path.join(import.meta.dirname, '../src/util/versions.ts')
await fs.writeFile(versionsFilePath, versionsFileContent, { encoding: 'utf8' });

/**
 * @param {*} value
 * @returns {string}
 */
function writeValue(value) {
    if (value === undefined) {
        return 'undefined';
    }

    return `'${value}'`;
}
