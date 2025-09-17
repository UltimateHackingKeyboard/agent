import { UhkBuffer, UserConfiguration } from '../../uhk-common/src/index.js';

import fs from 'fs';

const userConfig = JSON.parse(fs.readFileSync('../uhk-common/user-config-80.json', { encoding: 'utf8' }));

describe('Test Serializer', () => {
    it('full config match', () => {
        const config1Js = userConfig;
        const config1Ts: UserConfiguration = new UserConfiguration().fromJsonObject(config1Js);
        const config1Buffer = new UhkBuffer();
        config1Ts.toBinary(config1Buffer);
        const config1BufferContent = config1Buffer.getBufferContent();
        fs.writeFileSync('user-config.bin', config1BufferContent);

        config1Buffer.offset = 0;
        console.log();
        const config2Ts = new UserConfiguration().fromBinary(config1Buffer);
        console.log('\n');
        // Serialize and de-serialize the user config to drop the undefined values
        // otherwise jasmine toEqual matcher will complain
        const config2Js = JSON.parse(JSON.stringify(config2Ts.toJsonObject()));
        const config2Buffer = new UhkBuffer();
        config2Ts.toBinary(config2Buffer);
        fs.writeFileSync('user-config-serialized.json', JSON.stringify(config2Js, undefined, 4));
        const config2BufferContent = config1Buffer.getBufferContent();
        fs.writeFileSync('user-config-serialized.bin', config2BufferContent);

        expect(config1Js).toEqual(config2Js);

        const buffersContentsAreEqual: boolean = Buffer.compare(config1BufferContent, config2BufferContent) === 0;
        expect(buffersContentsAreEqual).toBe(true);

    });

    it('check json serializer', () => {
        const config1Ts: UserConfiguration = new UserConfiguration().fromJsonObject(userConfig);
        // Serialize and de-serialize the user config to drop the undefined values
        // otherwise jasmine toEqual matcher will complain
        const jsonObject = JSON.parse(JSON.stringify(config1Ts.toJsonObject()));

        expect(jsonObject).toEqual(userConfig);
    });
});
