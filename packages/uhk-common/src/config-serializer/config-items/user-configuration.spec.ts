import { UserConfiguration } from './user-configuration';

describe('user-configuration', () => {
    it('should be instantiate', () => {
        const config = new UserConfiguration();
        expect(config).toBeTruthy();
    });

    it('should transform an empty config', () => {
        jsonTester({
            dataModelVersion: 1,
            deviceName: 'My UHK',
            moduleConfigurations: [],
            macros: [],
            keymaps: []
        });
    });

    it('should transform a null keyActionType ', () => {
        jsonTester({
            dataModelVersion: 1,
            deviceName: 'My UHK',
            moduleConfigurations: [],
            macros: [],
            keymaps: [
                {
                    isDefault: true,
                    abbreviation: 'QWR',
                    name: 'QWERTY',
                    description: '',
                    layers: [{
                        modules: [{
                            id: 0,
                            pointerRole: 'move',
                            keyActions: [
                                null
                            ]
                        }]
                    }]
                }
            ]
        });
    });

    it('Should set the device name to "My UHK" if not exists in the config', () => {
        const original = {
            dataModelVersion: 1,
            moduleConfigurations: [],
            macros: [],
            keymaps: []
        };

        const config = new UserConfiguration();
        config.fromJsonObject(original);

        expect(config.deviceName).toEqual('My UHK');
    });

});

function jsonTester(json: any): void {
    const orig = JSON.parse(JSON.stringify(json));
    const config = new UserConfiguration();
    config.fromJsonObject(json);
    expect(json).toEqual(orig); // check the input json is not mutated
    const newJson = config.toJsonObject();
    expect(json).toEqual(orig); // check the input json is not mutated
    expect(newJson).toEqual(json);
}
