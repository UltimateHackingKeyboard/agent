import { describe, it } from 'node:test';

import {
    compareVersions,
    isVersionGt,
    isVersionGte,
    isVersionGteV1CanUndefined,
    isVersionGtMinor,
    isVersionLt,
    parseVersion,
    Version,
} from './version-helpers.js';

describe('compareVersions', () => {
    it('should return with 0 if the versions are same', ({assert}) => {
        const v1: Version = {
            major: 1,
            minor: 2,
            patch: 3,
        };

        const v2: Version = {
            major: 1,
            minor: 2,
            patch: 3,
        }

        const result = compareVersions(v1, v2);
        assert.equal(result, 0);
    })

    it('should return with -1 when v1: 1.0.0 and v2: 1.0.1', ({assert}) => {
        const v1: Version = {
            major: 1,
            minor: 0,
            patch: 0,
        };

        const v2: Version = {
            major: 1,
            minor: 0,
            patch: 1,
        }

        const result = compareVersions(v1, v2);
        assert.equal(result, -1);
    })

    it('should return with -1 when v1: 1.0.0 and v2: 1.1.0', ({assert}) => {
        const v1: Version = {
            major: 1,
            minor: 0,
            patch: 0,
        };

        const v2: Version = {
            major: 1,
            minor: 1,
            patch: 0,
        }

        const result = compareVersions(v1, v2);
        assert.equal(result, -1);
    })

    it('should return with -1 when v1: 1.0.0 and v2: 2.0.0', ({assert}) => {
        const v1: Version = {
            major: 1,
            minor: 0,
            patch: 0,
        };

        const v2: Version = {
            major: 2,
            minor: 0,
            patch: 0,
        }

        const result = compareVersions(v1, v2);
        assert.equal(result, -1);
    })

    it('should return with 1 when v1: 1.0.1 and v2: 1.0.0', ({assert}) => {
        const v1: Version = {
            major: 1,
            minor: 0,
            patch: 1,
        };

        const v2: Version = {
            major: 1,
            minor: 0,
            patch: 0,
        }

        const result = compareVersions(v1, v2);
        assert.equal(result, 1);
    })

    it('should return with 1 when v1: 1.1.0 and v2: 1.0.0', ({assert}) => {
        const v1: Version = {
            major: 1,
            minor: 1,
            patch: 0,
        };

        const v2: Version = {
            major: 1,
            minor: 0,
            patch: 0,
        }

        const result = compareVersions(v1, v2);
        assert.equal(result, 1);
    })

    it('should return with 1 when v1: 2.0.0 and v2: 1.0.0', ({assert}) => {
        const v1: Version = {
            major: 2,
            minor: 0,
            patch: 0,
        };

        const v2: Version = {
            major: 1,
            minor: 0,
            patch: 0,
        }

        const result = compareVersions(v1, v2);
        assert.equal(result, 1);
    })
})

describe('parseVersion', () => {
    it('should throw error for null version string', ({assert}) => {
        assert.throws(() => parseVersion(null), /Version string cannot be null or empty/);
    })

    it('should throw error for undefined version string', ({assert}) => {
        assert.throws(() => parseVersion(undefined), /Version string cannot be null or empty/);
    })

    it('should throw error for empty string', ({assert}) => {
        assert.throws(() => parseVersion(''), /Version string cannot be null or empty/);
    })

    it('should throw error for invalid version (foo)', ({assert}) => {
        assert.throws(() => parseVersion('foo'), /Invalid version format: foo/);
    })

    it('should throw error for invalid version (1)', ({assert}) => {
        assert.throws(() => parseVersion('1'), /Invalid version format: 1/);
    })

    it('should throw error for invalid version (1.1)', ({assert}) => {
        assert.throws(() => parseVersion('1.1'), /Invalid version format: 1.1/);
    })

    it('should parse 1.2.3 version string', ({assert}) => {
        const result = parseVersion('1.2.3');

        assert.equal(result.major, 1);
        assert.equal(result.minor, 2);
        assert.equal(result.patch, 3);
    })

    it('should parse 10.20.30 version string', ({assert}) => {
        const result = parseVersion('10.20.30');

        assert.equal(result.major, 10);
        assert.equal(result.minor, 20);
        assert.equal(result.patch, 30);
    })
})

describe('isVersionGt', () => {
    it('should return false if both version are same', ({assert}) => {
        const result = isVersionGt('1.2.3', '1.2.3');
        assert.equal(result, false);
    })

    it('should return true when v1 is greater than v2', ({assert}) => {
        const result = isVersionGt('1.0.1', '1.0.0');
        assert.equal(result, true);
    })

    it('should return false when v1 is smaller than v2', ({assert}) => {
        const result = isVersionGt('1.0.0', '1.0.1');
        assert.equal(result, false);
    })
})

describe('isVersionGte', () => {
    it('should return true if both version are same', ({assert}) => {
        const result = isVersionGte('1.2.3', '1.2.3');
        assert.equal(result, true);
    })

    it('should return true when v1 is greater than v2', ({assert}) => {
        const result = isVersionGte('1.0.1', '1.0.0');
        assert.equal(result, true);
    })

    it('should return false when v1 is smaller than v2', ({assert}) => {
        const result = isVersionGte('1.0.0', '1.0.1');
        assert.equal(result, false);
    })
})

describe('isVersionGteV1CanUndefined', () => {
    it('should return false when v1 is undefined', ({assert}) => {
        const result = isVersionGteV1CanUndefined(undefined, '1.0.0');
        assert.equal(result, false);
    })

    it('should return true when v1 is greater than v2', ({assert}) => {
        const result = isVersionGteV1CanUndefined('1.0.1', '1.0.0');
        assert.equal(result, true);
    })

    it('should return false when v1 is smaller than v2', ({assert}) => {
        const result = isVersionGteV1CanUndefined('1.0.0', '1.0.1');
        assert.equal(result, false);
    })
})

describe('isVersionLt', () => {
    it('should return false if versions are same', ({assert}) => {
        const result = isVersionLt('1.0.0', '1.0.0');
        assert.equal(result, false);
    })

    it('should return true if v1 is smaller than v2', ({assert}) => {
        const result = isVersionLt('1.0.0', '1.0.1');
        assert.equal(result, true);
    })

    it('should return false if v1 is greater than v2', ({assert}) => {
        const result = isVersionLt('1.0.1', '1.0.0');
        assert.equal(result, false);
    })
})

describe('isVersionGtMinor', () => {
    it('should return false if the 2 version are same', ({assert}) => {
        const result = isVersionGtMinor('1.2.3', '1.2.3');
        assert.equal(result, false);
    })

    it('should 1.2.0 > 1.1.0 => true', ({assert}) => {
        const result = isVersionGtMinor('1.2.0', '1.1.0');
        assert.equal(result, true);
    })

    it('should 1.1.1 > 1.1.0 => false', ({assert}) => {
        const result = isVersionGtMinor('1.1.1', '1.1.0');
        assert.equal(result, false);
    })

    it('should 2.0.0 > 1.0.0 => true', ({assert}) => {
        const result = isVersionGtMinor('2.0.0', '1.0.0');
        assert.equal(result, true);
    })
})
