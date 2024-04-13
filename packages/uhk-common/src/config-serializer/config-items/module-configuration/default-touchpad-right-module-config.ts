import { ModuleConfiguration } from '../module-configuration.js';
import { ModuleId } from './module-id.js';
import { NavigationMode } from './navigation-mode.js';

export function defaultTouchpadRightModuleConfig(): ModuleConfiguration {
    const config = new ModuleConfiguration();
    config.id = ModuleId.TouchpadRight;

    config.navigationModeBaseLayer = NavigationMode.Cursor;
    config.navigationModeModLayer = NavigationMode.Scroll;
    config.navigationModeFnLayer = NavigationMode.Caret;
    config.navigationModeMouseLayer = NavigationMode.Cursor;
    config.navigationModeFn2Layer = NavigationMode.Cursor;
    config.navigationModeFn3Layer = NavigationMode.Cursor;
    config.navigationModeFn4Layer = NavigationMode.Cursor;
    config.navigationModeFn5Layer = NavigationMode.Cursor;

    config.speed = 0.7;
    config.baseSpeed = 0.5;
    config.xceleration = 1;

    config.scrollSpeedDivisor = 8;
    config.caretSpeedDivisor = 16;

    config.scrollAxisLock = true;
    config.caretAxisLock = true;
    config.axisLockFirstTickSkew = 2;
    config.axisLockSkew = 0.5;

    config.invertScrollDirectionX = false;
    config.invertScrollDirectionY = false;

    config.touchpadPinchZoomDivisor = 4;
    config.touchpadHoldContinuationTimeout = 0;
    config.touchpadPinchToZoom = NavigationMode.Zoom;

    return config;
}
