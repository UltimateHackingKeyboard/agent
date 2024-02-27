import {ModuleConfiguration} from '../module-configuration.js';
import { ModuleId } from './module-id.js';
import { NavigationMode } from './navigation-mode.js';

export function defaultKeyClusterLeftModuleConfig(): ModuleConfiguration {
    const config = new ModuleConfiguration();
    config.id = ModuleId.KeyClusterLeft;

    config.navigationModeBaseLayer = NavigationMode.Scroll;
    config.navigationModeModLayer = NavigationMode.Cursor;
    config.navigationModeFnLayer = NavigationMode.Caret;
    config.navigationModeMouseLayer = NavigationMode.Cursor;
    config.navigationModeFn2Layer = NavigationMode.Cursor;
    config.navigationModeFn3Layer = NavigationMode.Cursor;
    config.navigationModeFn4Layer = NavigationMode.Cursor;
    config.navigationModeFn5Layer = NavigationMode.Cursor;

    config.speed = 0;
    config.baseSpeed = 5;
    config.xceleration = 0;

    config.scrollSpeedDivisor = 5;
    config.caretSpeedDivisor = 5;

    config.scrollAxisLock = true;
    config.caretAxisLock = true;
    config.axisLockFirstTickSkew = 0.5;
    config.axisLockSkew = 0.5;

    config.invertScrollDirectionY = false;

    config.keyClusterSwapAxes = false;
    config.keyClusterInvertHorizontalScrolling = false;

    return config;
}
