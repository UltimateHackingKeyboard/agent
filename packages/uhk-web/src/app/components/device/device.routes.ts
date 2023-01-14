import { Routes } from '@angular/router';

import { AdvancedSettingsPageComponent } from './advanced-settings/advanced-settings.page.component';
import { DeviceConfigurationComponent } from './configuration/device-configuration.component';
import { DeviceFirmwareComponent } from './firmware/device-firmware.component';
import { MouseSpeedComponent } from './mouse-speed/mouse-speed.component';
import { LEDBrightnessComponent } from './led-brightness/led-brightness.component';
import { RestoreConfigurationComponent } from './restore-configuration/restore-configuration.component';

export const deviceRoutes: Routes = [
    {
        path: 'device',
        children: [
            {
                path: '',
                redirectTo: 'configuration',
                pathMatch: 'full'
            },
            {
                path: 'advanced-settings',
                component: AdvancedSettingsPageComponent
            },
            {
                path: 'configuration',
                component: DeviceConfigurationComponent
            },
            {
                path: 'mouse-key-speed',
                component: MouseSpeedComponent
            },
            {
                path: 'led-brightness',
                component: LEDBrightnessComponent
            },
            {
                path: 'firmware',
                component: DeviceFirmwareComponent
            },
            {
                path: 'restore-user-configuration',
                component: RestoreConfigurationComponent
            }
        ]
    }
];
