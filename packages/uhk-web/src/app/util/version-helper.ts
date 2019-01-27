import * as semver from 'semver';
import { VersionInformation } from 'uhk-common';

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

let versions: VersionInformation;

export const getVersions = (): VersionInformation => {
    if (!versions) {
        versions = collectVersions();
    }
    return versions;
};

export const isVersionGte = (v1: string, v2: string): boolean => {
    if (!v1) {
        return false;
    }

    return semver.gte(v1, v2);
};
