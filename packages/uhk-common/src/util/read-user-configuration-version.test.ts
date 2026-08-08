import { describe, it } from 'node:test';

import { UhkBuffer } from '../config-serializer/uhk-buffer.js';
import {
    readUserConfigurationVersionFromBinary,
    readUserConfigurationVersionFromJsonObject,
} from './read-user-configuration-version.js';

describe('readUserConfigurationVersionFromBinary', () => {
    it('should read the version and restore the buffer offset', ({ assert }) => {
        const buffer = new UhkBuffer();
        buffer.writeUInt16(15);
        buffer.writeUInt16(1);
        buffer.writeUInt16(2);
        buffer.writeUInt16(99);
        buffer.offset = 0;

        assert.equal(readUserConfigurationVersionFromBinary(buffer), '15.1.2');
        assert.equal(buffer.offset, 0);
        assert.equal(buffer.readUInt16(), 15);
    });
});

describe('readUserConfigurationVersionFromJsonObject', () => {
    it('should read the version from a JSON object', ({ assert }) => {
        assert.equal(readUserConfigurationVersionFromJsonObject({
            userConfigMajorVersion: 15,
            userConfigMinorVersion: 1,
            userConfigPatchVersion: 0,
        }), '15.1.0');
    });

    it('should return undefined when version fields are missing', ({ assert }) => {
        assert.equal(readUserConfigurationVersionFromJsonObject({}), undefined);
        assert.equal(readUserConfigurationVersionFromJsonObject(null), undefined);
    });
});
