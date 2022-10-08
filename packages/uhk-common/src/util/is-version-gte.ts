import semver from 'semver';

export const isVersionGte = (v1: string, v2: string): boolean => {
    if (!v1) {
        return false;
    }

    return semver.gte(v1, v2);
};
