import semver from 'semver';

/**
 * 1.2.0 > 1.1.0 => true
 * 1.1.1 > 1.1.0 => false
 */
export const isVersionGtMinor = (v1: string, v2: string): boolean => {
    const v1Major = semver.major(v1);
    const v1Minor = semver.minor(v1);
    const v2Major = semver.major(v2);
    const v2Minor = semver.minor(v2);

    return v2Major < v1Major || (v2Major === v1Major && v1Minor > v2Minor);
};
