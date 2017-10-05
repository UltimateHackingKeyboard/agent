import { UhkBuffer, UserConfiguration } from '../../uhk-common/index';

const fs = require('fs');

const userConfig = JSON.parse(fs.readFileSync('../uhk-web/src/app/services/user-config.json'));

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
        const config2Js = config2Ts.toJsonObject();
        const config2Buffer = new UhkBuffer();
        config2Ts.toBinary(config2Buffer);
        fs.writeFileSync('user-config-serialized.json', JSON.stringify(config2Js, undefined, 4));
        const config2BufferContent = config1Buffer.getBufferContent();
        fs.writeFileSync('user-config-serialized.bin', config2BufferContent);

        expect(config1Js).toEqual(config2Js);

        const buffersContentsAreEqual: boolean = Buffer.compare(config1BufferContent, config2BufferContent) === 0;
        expect(buffersContentsAreEqual).toBe(true);

    });

    fit('check json serializer', () => {
        const config1Ts: UserConfiguration = new UserConfiguration().fromJsonObject(userConfig);
        const jsonObject = config1Ts.toJsonObject();

        expect(jsonObject).toEqual(userConfig);
    });
});
