import { VersionInformation } from 'uhk-common';

let versions: VersionInformation;

export const getVersions = (): VersionInformation => {
    if (!versions) {
        versions = collectVersions();
    }
    return versions;
};

const collectVersions = (): VersionInformation => {
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
