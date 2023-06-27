import { BacklightingMode } from './backlighting-mode.js';
import { UserConfiguration } from './user-configuration.js';

describe('user-configuration', () => {
    it('should be instantiate', () => {
        const config = new UserConfiguration();
        expect(config).toBeTruthy();
    });

    it('should transform an empty config', () => {
        jsonTester({
            userConfigMajorVersion: 6,
            userConfigMinorVersion: 0,
            userConfigPatchVersion: 0,
            deviceName: 'My UHK',
            doubleTapSwitchLayerTimeout: 250,
            iconsAndLayerTextsBrightness: 255,
            alphanumericSegmentsBrightness: 255,
            keyBacklightBrightness: 255,
            backlightingMode: BacklightingMode.FunctionalBacklighting,
            backlightingNoneActionColor: {r:0, g:0, b:0},
            backlightingScancodeColor: {r:255, g:255, b:255},
            backlightingModifierColor: {r:0, g:255, b:255},
            backlightingShortcutColor: {r:0, g:0, b:255},
            backlightingSwitchLayerColor: {r:255, g:255, b:0},
            backlightingSwitchKeymapColor: {r:255, g:0, b:0},
            backlightingMouseColor: {r:0, g:255, b:0},
            backlightingMacroColor: {r:255, g:0, b:255},
            mouseMoveInitialSpeed: 5,
            mouseMoveAcceleration: 35,
            mouseMoveDeceleratedSpeed: 10,
            mouseMoveBaseSpeed: 40,
            mouseMoveAcceleratedSpeed: 80,
            mouseScrollInitialSpeed: 20,
            mouseScrollAcceleration: 20,
            mouseScrollDeceleratedSpeed: 20,
            mouseScrollBaseSpeed: 20,
            mouseScrollAcceleratedSpeed: 50,
            moduleConfigurations: [],
            macros: [],
            keymaps: []
        });
    });

    it('Should set the device name to "My UHK" if not exists in the config', () => {
        const original = {
            userConfigMajorVersion: 1,
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
