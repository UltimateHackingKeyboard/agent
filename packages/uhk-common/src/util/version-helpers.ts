export interface Version {
    major: number;
    minor: number;
    patch: number;
}

/**
 * Compare 2 versions.
 * The return value logic is the same as the compare function of the array.sort function.
 *   -1 if v1 < v2
 *   0 if v1 == v2
 *   1 if v1 > v2
 */
export function compareVersions(v1: Version, v2: Version): number {
    if (v1.major < v2.major) {
        return -1
    }
    if (v1.major > v2.major) {
        return 1
    }
    if (v1.minor < v2.minor) {
        return -1
    }
    if (v1.minor > v2.minor) {
        return 1
    }
    if (v1.patch < v2.patch) {
        return -1
    }
    if (v1.patch > v2.patch) {
        return 1
    }
    return 0
}

export function parseVersion(version: string): Version {
    if (!version) {
        throw new Error('Version string cannot be null or empty');
    }

    const [major, minor, patch] = version.split('.').map(Number);

    if(major === undefined || minor === undefined || patch === undefined) {
        throw new Error(`Invalid version format: ${version}`);
    }

    if(Number.isNaN(major) || Number.isNaN(minor) || Number.isNaN(patch)) {
        throw new Error(`Invalid version format: ${version}`);
    }

    return { major, minor, patch };
}

export const isVersionGt = (v1: string, v2: string): boolean => {
    const versionV1 = parseVersion(v1)
    const versionV2 = parseVersion(v2)

    return compareVersions(versionV1, versionV2) === 1;
};

export const isVersionGte = (v1: string, v2: string): boolean => {
    const versionV1 = parseVersion(v1)
    const versionV2 = parseVersion(v2)

    return compareVersions(versionV1, versionV2) >= 0;
};

export const isVersionGteV1CanUndefined = (v1: string, v2: string): boolean => {
    if (!v1) {
        return false;
    }

    return isVersionGte(v1, v2);
};

export const isVersionLt = (v1: string, v2: string): boolean => {
    const versionV1 = parseVersion(v1)
    const versionV2 = parseVersion(v2)

    return compareVersions(versionV1, versionV2) === -1;
};

/**
 * 1.2.0 > 1.1.0 => true
 * 1.1.1 > 1.1.0 => false
 */
export const isVersionGtMinor = (v1: string, v2: string): boolean => {
    const versionV1 = parseVersion(v1)
    const versionV2 = parseVersion(v2)

    return versionV2.major < versionV1.major || (versionV2.major === versionV1.major && versionV1.minor > versionV2.minor);
};
