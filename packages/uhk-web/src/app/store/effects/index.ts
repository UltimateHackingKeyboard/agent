import { DeviceEffects } from './device';
import { AutoUpdateSettingsEffects } from './auto-update-settings';
import { MacroEffects } from './macro';
import { KeymapEffects } from './keymap';
import { UserConfigEffects } from './user-config';
import { ApplicationEffects } from './app';

export * from './keymap';
export * from './macro';
export * from './user-config';
export * from './auto-update-settings';
export * from './app';

export const effects = [
    ApplicationEffects,
    UserConfigEffects,
    KeymapEffects,
    MacroEffects,
    AutoUpdateSettingsEffects,
    DeviceEffects
];
