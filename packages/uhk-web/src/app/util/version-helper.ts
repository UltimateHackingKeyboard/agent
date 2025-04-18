import { VersionInformation } from 'uhk-common';

const collectVersions = (): VersionInformation => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const pkgJson = require('../../../../../package.json');
    return {
        version: pkgJson['version'],
        firmwareVersion: pkgJson['firmwareVersion'],
        deviceProtocolVersion: pkgJson['deviceProtocolVersion'],
        moduleProtocolVersion: pkgJson['moduleProtocolVersion'],
        userConfigVersion: pkgJson['userConfigVersion'],
        hardwareConfigVersion: pkgJson['hardwareConfigVersion']
    };
};

let versions: VersionInformation;

export const getVersions = (): VersionInformation => {
    if (!versions) {
        versions = collectVersions();
    }
    return versions;
};
