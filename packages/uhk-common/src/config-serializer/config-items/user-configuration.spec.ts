import { UserConfiguration } from './user-configuration.js';

describe('user-configuration', () => {
    it('should be instantiate', () => {
        const config = new UserConfiguration();
        expect(config).toBeTruthy();
    });

    it('should transform an empty config', () => {
        jsonTester({
            userConfigMajorVersion: 7,
            userConfigMinorVersion: 0,
            userConfigPatchVersion: 0,
            deviceName: 'My UHK',
            doubleTapSwitchLayerTimeout: 250,
            iconsAndLayerTextsBrightness: 255,
            alphanumericSegmentsBrightness: 255,
            keyBacklightBrightness: 255,
            ledsFadeTimeout: 0,
            perKeyRgbPresent: false,
            backlightingMode: 'FunctionalBacklighting',
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
            secondaryRoleStrategy: 'Simple',
            secondaryRoleAdvancedStrategyDoubletapTimeout: 200,
            secondaryRoleAdvancedStrategyTimeout: 350,
            secondaryRoleAdvancedStrategySafetyMargin: 50,
            secondaryRoleAdvancedStrategyTriggerByRelease: true,
            secondaryRoleAdvancedStrategyDoubletapToPrimary: true,
            secondaryRoleAdvancedStrategyTimeoutAction: 'Secondary',
            mouseScrollAxisSkew: 1,
            mouseMoveAxisSkew: 1,
            diagonalSpeedCompensation: false,
            doubletapTimeout: 400,
            keystrokeDelay: 0,
            moduleConfigurations: [
                {
                    id: 'KeyClusterLeft',
                    navigationModeBaseLayer: 'Cursor',
                    navigationModeModLayer: 'Cursor',
                    navigationModeFnLayer: 'Cursor',
                    navigationModeMouseLayer: 'Cursor',
                    navigationModeFn2Layer: 'Cursor',
                    navigationModeFn3Layer: 'Cursor',
                    navigationModeFn4Layer: 'Cursor',
                    navigationModeFn5Layer: 'Cursor',
                    speed: 0,
                    baseSpeed: 5,
                    xceleration: 0,
                    scrollSpeedDivisor: 5,
                    caretSpeedDivisor: 5,
                    scrollAxisLock: true,
                    caretAxisLock: true,
                    axisLockFirstTickSkew: 0.5,
                    axisLockSkew: 0.5,
                    invertScrollDirectionY: false,
                    keyClusterSwapAxes: false,
                    keyClusterInvertHorizontalScrolling: false
                },
                {
                    id: 'TouchpadRight',
                    navigationModeBaseLayer: 'Cursor',
                    navigationModeModLayer: 'Cursor',
                    navigationModeFnLayer: 'Cursor',
                    navigationModeMouseLayer: 'Cursor',
                    navigationModeFn2Layer: 'Cursor',
                    navigationModeFn3Layer: 'Cursor',
                    navigationModeFn4Layer: 'Cursor',
                    navigationModeFn5Layer: 'Cursor',
                    speed: 0.7,
                    baseSpeed: 0.5,
                    xceleration: 1,
                    scrollSpeedDivisor: 8,
                    caretSpeedDivisor: 16,
                    scrollAxisLock: true,
                    caretAxisLock: true,
                    axisLockFirstTickSkew: 2,
                    axisLockSkew: 0.5,
                    invertScrollDirectionY: false,
                    touchpadPinchZoomDivisor: 4,
                    touchpadHoldContinuationTimeout: 0,
                    touchpadPinchToZoom: 'Zoom'
                },
                {
                    id: 'TrackballRight',
                    navigationModeBaseLayer: 'Cursor',
                    navigationModeModLayer: 'Cursor',
                    navigationModeFnLayer: 'Cursor',
                    navigationModeMouseLayer: 'Cursor',
                    navigationModeFn2Layer: 'Cursor',
                    navigationModeFn3Layer: 'Cursor',
                    navigationModeFn4Layer: 'Cursor',
                    navigationModeFn5Layer: 'Cursor',
                    speed: 0.5,
                    baseSpeed: 0.5,
                    xceleration: 1,
                    scrollSpeedDivisor: 8,
                    caretSpeedDivisor: 16,
                    scrollAxisLock: true,
                    caretAxisLock: true,
                    axisLockFirstTickSkew: 2,
                    axisLockSkew: 0.5,
                    invertScrollDirectionY: false
                },
                {
                    id: 'TrackpointRight',
                    navigationModeBaseLayer: 'Cursor',
                    navigationModeModLayer: 'Cursor',
                    navigationModeFnLayer: 'Cursor',
                    navigationModeMouseLayer: 'Cursor',
                    navigationModeFn2Layer: 'Cursor',
                    navigationModeFn3Layer: 'Cursor',
                    navigationModeFn4Layer: 'Cursor',
                    navigationModeFn5Layer: 'Cursor',
                    speed: 1,
                    baseSpeed: 0,
                    xceleration: 0,
                    scrollSpeedDivisor: 8,
                    caretSpeedDivisor: 16,
                    scrollAxisLock: true,
                    caretAxisLock: true,
                    axisLockFirstTickSkew: 2,
                    axisLockSkew: 0.5,
                    invertScrollDirectionY: false
                }
            ],
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
